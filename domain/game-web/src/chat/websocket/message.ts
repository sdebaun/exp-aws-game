import { APIGatewayProxyHandler } from "aws-lambda";
import { ConnectionEntity } from "./entities";
import { ChatMessageEntity } from "../entity";
import { ulid } from "ulid";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("========== MESSAGE HANDLER INVOKED ==========");
  // console.log("Event:", JSON.stringify(event, null, 2));

  const connectionId = event.requestContext.connectionId!;

  if (!event.body) {
    console.log("No message body received");
    return { statusCode: 400, body: "No message body" };
  }

  try {
    // Get connection info to validate the sender
    const connection = await ConnectionEntity.get({
      connectionId,
    }).go();

    if (!connection.data) {
      return { statusCode: 403, body: "Connection not found" };
    }

    // Parse the message
    const data = JSON.parse(event.body);
    const { action, message } = data;

    if (action === "sendMessage" && message) {
      console.log("Received message:", message);
      // Create and persist the message
      // The DDB stream will handle broadcasting
      const newMessage = {
        messageId: ulid(),
        roomId: connection.data.roomId,
        username: connection.data.username,
        message: message,
        timestamp: new Date().toISOString(),
      };

      console.log("Creating message:", newMessage);

      const sent = await ChatMessageEntity.create(newMessage).go();
      console.log("Sent", sent);

      return { statusCode: 200, body: "Message sent" };
    }

    return { statusCode: 400, body: "Unknown action" };
  } catch (error) {
    console.error("Failed to process message:", error);
    return { statusCode: 500, body: "Failed to process message" };
  }
};
