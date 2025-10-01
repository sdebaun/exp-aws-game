import { DynamoDBStreamHandler } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { Resource } from "sst";
import { ConnectionEntity } from "./entities";
import { ChatMessageEntity } from "../entity";

const api = new ApiGatewayManagementApi({
  endpoint: Resource.ChatApi.managementEndpoint,
});

export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(
    "Stream broadcaster invoked with",
    event.Records.length,
    "records",
  );

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

    // Use ElectroDB to parse and validate if this is a ChatMessage
    let chatMessage;
    try {
      const parsedMessage = ChatMessageEntity.parse({ Item: item });
      console.log("Parse result:", JSON.stringify(parsedMessage, null, 2));

      if (!parsedMessage?.data) {
        console.log(
          "Not a valid ChatMessage entity, parsedMessage:",
          parsedMessage,
        );
        continue;
      }
      chatMessage = parsedMessage.data;
      console.log("Parsed ChatMessage:", chatMessage);
    } catch (error) {
      console.log("Failed to parse as ChatMessage:", error);
      continue;
    }

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
      // Get all connections in the room
      const roomConnections = await ConnectionEntity.query
        .byRoom({ roomId: chatMessage.roomId })
        .go();

      // Broadcast to all connections
      const sendPromises = roomConnections.data.map(async (conn) => {
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
            await ConnectionEntity.delete({
              connectionId: conn.connectionId,
            }).go();
          } else {
            console.error(`Failed to send to ${conn.connectionId}:`, error);
          }
        }
      });

      await Promise.all(sendPromises);
      console.log(
        `Broadcasted message to ${roomConnections.data.length} connections in room ${chatMessage.roomId}`,
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
