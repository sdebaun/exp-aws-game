import { APIGatewayProxyHandler } from "aws-lambda";
import { ConnectionEntity } from "./entities";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("========== DISCONNECT HANDLER INVOKED ==========");
  console.log("Event:", JSON.stringify(event, null, 2));
  
  const connectionId = event.requestContext.connectionId!;
  
  console.log(`WebSocket disconnect: ${connectionId}`);
  
  try {
    // Remove the connection from DynamoDB
    await ConnectionEntity.delete({
      connectionId,
    }).go();
    
    return { statusCode: 200, body: "Disconnected" };
  } catch (error) {
    console.error("Failed to remove connection:", error);
    // Return success anyway - the connection is already closed
    return { statusCode: 200, body: "Disconnected" };
  }
};