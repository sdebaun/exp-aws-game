import { DynamoDBStreamHandler } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { Resource } from "sst";
import { ConnectionEntity } from "./entities";

const api = new ApiGatewayManagementApi({
  endpoint: Resource.ChatApi.managementEndpoint,
});

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    // Only process INSERT events for new messages
    if (record.eventName !== "INSERT") continue;

    const newImage = record.dynamodb?.NewImage;
    if (!newImage) continue;

    // Convert DynamoDB format to plain object
    const item = unmarshall(newImage as Record<string, AttributeValue>);

    // Check if this is a chat message (pk starts with "CHAT#")
    if (!item.pk?.startsWith("CHAT#") || !item.sk?.startsWith("MSG#")) {
      continue;
    }

    // Extract message data
    const roomId = item.pk.replace("CHAT#", "");
    const messagePayload = JSON.stringify({
      type: "message",
      data: {
        messageId: item.messageId,
        username: item.username,
        message: item.message,
        timestamp: item.timestamp,
        roomId: roomId,
      },
    });

    try {
      // Get all connections in the room
      const roomConnections = await ConnectionEntity.query
        .byRoom({ roomId })
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
          if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 410) {
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
        `Broadcasted message to ${roomConnections.data.length} connections in room ${roomId}`,
      );
    } catch (error) {
      console.error(`Failed to broadcast message for room ${roomId}:`, error);
    }
  }

  return { batchItemFailures: [] };
};
