import { APIGatewayProxyHandler } from "aws-lambda";
import { ChatConnectionEntity } from "../ChatConnectionEntity";

console.log("===== CONNECT.TS LOADED =====");

export const handler: APIGatewayProxyHandler = async (event) => {
  const connectionId = event.requestContext.connectionId!;

  // For now, we'll extract user info from query parameters
  // In production, this should come from a JWT token or session
  const username = event.queryStringParameters?.username || "anonymous";
  const roomId = event.queryStringParameters?.roomId || "public";

  console.log(
    `WebSocket connection attempt: ${connectionId} as ${username} in room ${roomId}`,
  );

  try {
    // Store the connection info in DynamoDB
    await ChatConnectionEntity.create({
      connectionId,
      username,
      roomId,
      connectedAt: Date.now(),
    }).go();

    return { statusCode: 200, body: "Connected" };
  } catch (error) {
    console.error("Failed to store connection:", error);
    return { statusCode: 500, body: "Failed to connect" };
  }
};
