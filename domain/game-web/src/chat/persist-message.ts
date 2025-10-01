// import { Resource } from "sst";
// import { ChatMessageEntity } from "./entity";
// import { ulid } from "ulid";

// export interface ChatMessage {
//   roomId: string;
//   username: string;
//   message: string;
//   timestamp?: number;
// }

// export async function handler(event: any) {
//   console.log("Chat persist message event:", JSON.stringify(event, null, 2));

//   try {
//     // The event structure depends on how SST Realtime invokes this
//     // We'll handle both direct invocations and potential batch messages
//     const messages = Array.isArray(event) ? event : [event];

//     for (const msg of messages) {
//       // Extract message data - adjust based on actual event structure
//       const { roomId, username, message, timestamp } = msg;

//       if (!roomId || !username || !message) {
//         console.error("Invalid message format:", msg);
//         continue;
//       }

//       // Create and persist the message
//       await ChatMessageEntity.create({
//         roomId,
//         username,
//         message,
//         messageId: ulid(),
//         timestamp: timestamp || Date.now(),
//       }).go();

//       console.log(`Persisted message from ${username} in room ${roomId}`);
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true }),
//     };
//   } catch (error) {
//     console.error("Error persisting chat message:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         error: "Failed to persist message",
//         details: error instanceof Error ? error.message : String(error),
//       }),
//     };
//   }
// }
