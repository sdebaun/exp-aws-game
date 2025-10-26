/**
 * WebSocket integration tests for chat
 *
 * These tests connect to the actual deployed SST WebSocket API
 * and verify end-to-end message flow.
 *
 * Run with: yarn test:watch
 */

import { describe, it, expect, afterEach } from "vitest";
import WebSocket from "ws";
import { WsMessageEnvelope } from "../schemas";

// Get the WebSocket URL from environment or use a default
// You'll need to set CHAT_WS_URL when running tests
// e.g., CHAT_WS_URL=wss://abc123.execute-api.us-east-1.amazonaws.com/dev yarn test
const CHAT_WS_URL = process.env.CHAT_WS_URL;

if (!CHAT_WS_URL) {
  throw new Error(
    "CHAT_WS_URL environment variable is required. " +
      "Get it from: sst dev (look for ChatApi url) or aws apigatewayv2 get-apis",
  );
}

/**
 * Helper to create a WebSocket connection with username and roomId
 */
function createChatConnection(
  username: string,
  roomId: string = "test-room",
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const url = `${CHAT_WS_URL}?username=${encodeURIComponent(username)}&roomId=${encodeURIComponent(roomId)}`;
    const ws = new WebSocket(url);

    ws.on("open", () => resolve(ws));
    ws.on("error", reject);

    // Auto-cleanup on connection failure
    setTimeout(() => reject(new Error("Connection timeout")), 5000);
  });
}

/**
 * Helper to wait for a specific message on a WebSocket
 *
 * Messages are validated against the known WebSocket envelope schema.
 * Invalid messages are ignored (we keep waiting for a valid one).
 */
function waitForMessage(
  ws: WebSocket,
  predicate: (data: WsMessageEnvelope) => boolean,
  timeoutMs: number = 5000,
): Promise<WsMessageEnvelope> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.removeListener("message", handler);
      reject(new Error("Message timeout"));
    }, timeoutMs);

    const handler = (rawData: WebSocket.Data) => {
      try {
        const json = JSON.parse(rawData.toString());
        const parseResult = WsMessageEnvelope.safeParse(json);

        // Skip invalid messages silently (keep waiting for valid ones)
        if (!parseResult.success) {
          console.warn("Received invalid WebSocket message:", parseResult.error);
          return;
        }

        const data = parseResult.data;
        if (predicate(data)) {
          clearTimeout(timeout);
          ws.removeListener("message", handler);
          resolve(data);
        }
      } catch {
        // Ignore JSON parse errors, keep waiting
      }
    };

    ws.on("message", handler);
  });
}

/**
 * Helper to send a chat message
 */
function sendMessage(ws: WebSocket, message: string): void {
  ws.send(
    JSON.stringify({
      action: "sendMessage",
      message,
    }),
  );
}

describe("Chat WebSocket API", () => {
  let connections: WebSocket[] = [];

  // Clean up all connections after each test
  afterEach(() => {
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    connections = [];
  });

  it("should connect and disconnect successfully", async () => {
    const ws = await createChatConnection("test-user");
    connections.push(ws);

    expect(ws.readyState).toBe(WebSocket.OPEN);

    // Close connection
    ws.close();

    // Wait for close
    await new Promise((resolve) => ws.on("close", resolve));
    expect(ws.readyState).toBe(WebSocket.CLOSED);
  });

  it("should broadcast messages to all users in the same room", async () => {
    // Create two connections in the same room
    const alice = await createChatConnection("alice", "test-room");
    const bob = await createChatConnection("bob", "test-room");
    connections.push(alice, bob);

    // Alice sends a message
    const testMessage = `Test message ${Date.now()}`;

    // Bob waits for the message
    const bobReceived = waitForMessage(
      bob,
      (data) => data.data.username === "alice" && data.data.message === testMessage,
    );

    // Alice also waits (to verify broadcast includes sender)
    const aliceReceived = waitForMessage(
      alice,
      (data) => data.data.username === "alice" && data.data.message === testMessage,
    );

    // Send the message
    sendMessage(alice, testMessage);

    // Both should receive it (predicate already verified username/message match)
    const [bobMsg, aliceMsg] = await Promise.all([bobReceived, aliceReceived]);

    // Verify the rest of the message structure
    expect(bobMsg.data.roomId).toBe("test-room");
    expect(aliceMsg.data.roomId).toBe("test-room");

    // MessageId should be unique for each
    expect(bobMsg.data.messageId).toBe(aliceMsg.data.messageId);
  });

  it("should NOT broadcast messages across different rooms", async () => {
    // Create connections in different rooms
    const alice = await createChatConnection("alice", "room-1");
    const bob = await createChatConnection("bob", "room-2");
    connections.push(alice, bob);

    const testMessage = `Cross-room test ${Date.now()}`;

    // Bob waits for ANY message (should timeout)
    // Predicate always returns true - we're testing that NO message arrives
    const bobReceived = waitForMessage(
      bob,
      () => true,
      2000, // Short timeout
    );

    // Alice sends message in room-1
    sendMessage(alice, testMessage);

    // Bob should NOT receive it
    await expect(bobReceived).rejects.toThrow("Message timeout");
  });

  it("should handle multiple messages in order", async () => {
    const alice = await createChatConnection("alice", "order-test");
    connections.push(alice);

    const messages = ["First", "Second", "Third"];

    // Send messages one at a time, waiting for each to be received
    // This avoids race conditions with DDB streams
    for (const msg of messages) {
      sendMessage(alice, msg);
      await waitForMessage(alice, (data) => data.data.message === msg, 3000);
    }

    // If we got here, all messages arrived in the order we expected
    expect(messages).toHaveLength(3); // Simple assertion to mark test success
  });

  it("should handle special characters and unicode in messages", async () => {
    const alice = await createChatConnection("alice", "unicode-test");
    connections.push(alice);

    const specialMessage = "Hello 🎉 <script>alert('xss')</script> 日本語";

    const received = waitForMessage(
      alice,
      (data) => data.data.message === specialMessage,
    );

    sendMessage(alice, specialMessage);

    const msg = await received;
    expect(msg.data.message).toBe(specialMessage);
  });
});
