// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../sst-env.d.ts" />

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Table } from "dynamodb-onetable";
import { Resource } from "sst";
// import { zodOneModelSchema } from "zod-to-dynamodb-onetable-schema";
import { ChatMessageSchema, ChatConnectionSchema } from "./schemas";

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { zodOneModelSchema } = require("zod-to-dynamodb-onetable-schema")

/**
 * DynamoDB clients
 *
 * We use the DocumentClient wrapper for automatic marshalling/unmarshalling
 */
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true, // Don't send undefined values to DynamoDB
    convertEmptyValues: false, // Throw on empty strings/sets
  },
});

/**
 * OneTable schema for chat domain
 *
 * Index configuration must match the SST stack definition in domain/game-web/stack.ts
 */
const ChatTableSchema = {
  format: "onetable:1.1.0" as const,
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
    gsi1: { hash: "gsi1pk", sort: "gsi1sk", project: "all" },
  },
  models: {
    ChatMessage: zodOneModelSchema(ChatMessageSchema),
    ChatConnection: zodOneModelSchema(ChatConnectionSchema),
  },
  params: {
    isoDates: true, // Use ISO date strings
    timestamps: false, // We manage timestamps manually
    typeField: "_type", // OneTable adds this to distinguish entity types
  },
} as const;

/**
 * The chat table instance
 *
 * Usage:
 *   // Create
 *   const msg = await ChatTable.create('ChatMessage', { roomId, message, username, ... })
 *
 *   // Get by primary key
 *   const conn = await ChatTable.get('ChatConnection', { connectionId })
 *
 *   // Query by index
 *   const messages = await ChatTable.find('ChatMessage', { roomId })
 *   const connections = await ChatTable.find('ChatConnection', { roomId }, { index: 'gsi1' })
 */
export const ChatTable = new Table({
  client: docClient,
  name: Resource.GameTable.name,
  schema: ChatTableSchema,
  logger: process.env.NODE_ENV === "development" ? console.log : false,
});

/**
 * Type-safe model accessors
 *
 * These give you full TypeScript autocomplete for entity operations
 */
export const ChatMessageModel = ChatTable.getModel("ChatMessage");
export const ChatConnectionModel = ChatTable.getModel("ChatConnection");
