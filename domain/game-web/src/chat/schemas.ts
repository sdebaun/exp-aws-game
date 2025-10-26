/**
 * Zod schemas for chat domain entities
 *
 * These schemas serve dual purposes:
 * 1. Runtime validation via Zod
 * 2. OneTable model generation via zod-to-dynamodb-onetable-schema
 *
 * The pk/sk literals use OneTable template syntax: ${fieldName}
 */

import { z } from "zod";

/**
 * ChatMessage: individual messages in a room
 *
 * Access patterns:
 * - Get all messages in a room (primary index: pk=ROOM#<roomId>)
 * - Get all messages by user (GSI1: gsi1pk=USER#<username>)
 */
export const ChatMessageBase = z.object({
  messageId: z.string().min(1), // Will be a UUID or ULID
  roomId: z.string().min(1),
  message: z.string().min(1),
  username: z.string().min(1),
  timestamp: z.string().datetime(), // ISO 8601 datetime strings (Zod v3 API)
});

export const ChatMessageSchema = ChatMessageBase.extend({
  pk: z.literal("ROOM#${roomId}"),
  sk: z.literal("MSG#${timestamp}#${messageId}"),
  gsi1pk: z.literal("USER#${username}"),
  gsi1sk: z.literal("MSG#${timestamp}"),
});

export type ChatMessage = z.infer<typeof ChatMessageBase>;
export type ChatMessageRecord = z.infer<typeof ChatMessageSchema>;

/**
 * ChatConnection: active WebSocket connections
 *
 * Access patterns:
 * - Get connection by ID (primary index: pk=CONN#<connectionId>)
 * - Get all connections in a room (GSI1: gsi1pk=ROOM#<roomId>)
 */
const ChatConnectionBase = z.object({
  connectionId: z.string().min(1),
  username: z.string().min(1),
  roomId: z.string().min(1),
  connectedAt: z.number().int().positive(),
});

export const ChatConnectionSchema = ChatConnectionBase.extend({
  pk: z.literal("CONN#${connectionId}"),
  sk: z.literal("LOOKUP"), // Static value for point lookups
  gsi1pk: z.literal("ROOM#${roomId}"),
  gsi1sk: z.literal("CONN#${connectionId}"),
});

export type ChatConnection = z.infer<typeof ChatConnectionBase>;
export type ChatConnectionRecord = z.infer<typeof ChatConnectionSchema>;

/**
 * WebSocket message envelope sent to clients
 *
 * This is the actual message shape sent over the WebSocket connection.
 * Note: timestamp is converted from ISO string (DB) to unix timestamp (wire)
 */
export const WsMessageEnvelope = z.object({
  type: z.literal("message"),
  data: z.object({
    messageId: z.string(),
    username: z.string(),
    message: z.string(),
    timestamp: z.number(), // Unix timestamp in milliseconds
    roomId: z.string(),
  }),
});

export type WsMessageEnvelope = z.infer<typeof WsMessageEnvelope>;
