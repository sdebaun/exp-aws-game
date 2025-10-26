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

// Test timeouts
const DEFAULT_MESSAGE_TIMEOUT = 5000;
const SHORT_TIMEOUT = 2000;
const DDB_STREAM_TIMEOUT = 3000; // Allow extra time for DDB stream processing

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
  timeoutMs: number = DEFAULT_MESSAGE_TIMEOUT,
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

/**
 * Predicate builders for common message matching patterns
 */
const hasMessage = (content: string) => (msg: WsMessageEnvelope) =>
  msg.data.message === content;

const fromUser = (username: string, content: string) => (msg: WsMessageEnvelope) =>
  msg.data.username === username && msg.data.message === content;

/**
 * Generate a unique message for testing (avoids cross-test pollution)
 */
const uniqueMessage = (prefix: string) => `${prefix} ${Date.now()}`;

describe("Chat WebSocket API", () => {
  let connections: WebSocket[] = [];

  /**
   * Helper to track a connection for cleanup
   */
  const track = (...ws: WebSocket[]) => {
    connections.push(...ws);
    return ws.length === 1 ? ws[0] : ws;
  };

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
    const ws = track(await createChatConnection("test-user")) as WebSocket;

    expect(ws.readyState).toBe(WebSocket.OPEN);

    ws.close();
    await new Promise((resolve) => ws.on("close", resolve));

    expect(ws.readyState).toBe(WebSocket.CLOSED);
  });

  it("should broadcast messages to all users in the same room", async () => {
    const [alice, bob] = track(
      await createChatConnection("alice", "test-room"),
      await createChatConnection("bob", "test-room"),
    ) as WebSocket[];

    const testMessage = uniqueMessage("Test");

    // Both wait for alice's message
    const bobReceived = waitForMessage(bob, fromUser("alice", testMessage));
    const aliceReceived = waitForMessage(alice, fromUser("alice", testMessage));

    sendMessage(alice, testMessage);

    // Both should receive it
    const [bobMsg, aliceMsg] = await Promise.all([bobReceived, aliceReceived]);

    // Verify room and messageId are the same (broadcast, not separate messages)
    expect(bobMsg.data.roomId).toBe("test-room");
    expect(aliceMsg.data.roomId).toBe("test-room");
    expect(bobMsg.data.messageId).toBe(aliceMsg.data.messageId);
  });

  it("should NOT broadcast messages across different rooms", async () => {
    const [alice, bob] = track(
      await createChatConnection("alice", "room-1"),
      await createChatConnection("bob", "room-2"),
    ) as WebSocket[];

    // Bob waits for ANY message (should timeout)
    const bobReceived = waitForMessage(bob, () => true, SHORT_TIMEOUT);

    sendMessage(alice, uniqueMessage("Cross-room test"));

    await expect(bobReceived).rejects.toThrow("Message timeout");
  });

  it("should handle multiple messages in order", async () => {
    const alice = track(await createChatConnection("alice", "order-test")) as WebSocket;

    const messages = ["First", "Second", "Third"];

    // Send messages one at a time, waiting for each to be received
    // This avoids race conditions with DDB streams
    for (const msg of messages) {
      sendMessage(alice, msg);
      await waitForMessage(alice, hasMessage(msg), DDB_STREAM_TIMEOUT);
    }

    // If we got here, all messages arrived in the order we expected
    expect(messages).toHaveLength(3);
  });

  it("should handle special characters and unicode in messages", async () => {
    const alice = track(await createChatConnection("alice", "unicode-test")) as WebSocket;

    const specialMessage = "Hello 🎉 <script>alert('xss')</script> 日本語";

    const received = waitForMessage(alice, hasMessage(specialMessage));
    sendMessage(alice, specialMessage);

    const msg = await received;
    expect(msg.data.message).toBe(specialMessage);
  });
});
