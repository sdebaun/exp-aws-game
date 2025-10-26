import { DynamoDBStreamHandler } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { Resource } from "sst";
import { ChatConnectionModel } from "../table";
import { ChatMessageBase } from "../schemas";

const api = new ApiGatewayManagementApi({
  endpoint: Resource.ChatApi.managementEndpoint,
});

/**
 * Listens to the ddb stream for new chat messages
 * and then fans the change out to all the connections in the originating room
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log("stream-broadcaster", { recordCount: event.Records.length });

  for (const record of event.Records) {
    // Only process INSERT events for new messages
    if (record.eventName !== "INSERT") {
      console.log("Skipping non-INSERT event:", record.eventName);
      continue;
    }

    const newImage = record.dynamodb?.NewImage;
    if (!newImage) {
      console.log("No NewImage in record");
      continue;
    }

    // Convert DynamoDB format to plain object
    const item = unmarshall(newImage as Record<string, AttributeValue>);
    console.log("Unmarshalled item:", JSON.stringify(item, null, 2));

    // Use Zod to parse and validate if this is a ChatMessage
    // OneTable stores the entity type in _type field
    if (item._type !== "ChatMessage") {
      console.log("Not a ChatMessage entity, skipping:", item._type);
      continue;
    }

    // Validate using the Base schema (without pk/sk template fields)
    // The actual pk/sk values are resolved by OneTable and won't match the literals
    const parseResult = ChatMessageBase.safeParse(item);
    if (!parseResult.success) {
      console.log("Failed to parse as ChatMessage:", parseResult.error);
      continue;
    }

    const chatMessage = parseResult.data;
    console.log("Parsed ChatMessage:", chatMessage);

    // Build message payload from parsed data
    const messagePayload = JSON.stringify({
      type: "message",
      data: {
        messageId: chatMessage.messageId,
        username: chatMessage.username,
        message: chatMessage.message,
        timestamp: new Date(chatMessage.timestamp).getTime(),
        roomId: chatMessage.roomId,
      },
    });

    try {
      // Get all connections in the room using GSI1
      // OneTable's find() returns an array directly
      const roomConnections = await ChatConnectionModel.find(
        { roomId: chatMessage.roomId },
        { index: "gsi1" }
      );

      // Broadcast to all connections
      const sendPromises = roomConnections.map(async (conn) => {
        try {
          await api.postToConnection({
            ConnectionId: conn.connectionId,
            Data: messagePayload,
          });
        } catch (error) {
          // If connection is stale (410 Gone), remove it
          if (
            error && typeof error === "object" && "statusCode" in error &&
            error.statusCode === 410
          ) {
            console.log(`Removing stale connection: ${conn.connectionId}`);
            await ChatConnectionModel.remove({
              connectionId: conn.connectionId,
            });
          } else {
            console.error(`Failed to send to ${conn.connectionId}:`, error);
          }
        }
      });

      await Promise.all(sendPromises);
      console.log(
        `Broadcasted message to ${roomConnections.length} connections in room ${chatMessage.roomId}`,
      );
    } catch (error) {
      console.error(
        `Failed to broadcast message for room ${chatMessage.roomId}:`,
        error,
      );
    }
  }

  return { batchItemFailures: [] };
};
