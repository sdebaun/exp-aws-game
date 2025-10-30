// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../sst-env.d.ts" />

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Table } from "dynamodb-onetable";
import { Resource } from "sst";
import { CharacterSchema, PoolCounterSchema } from "./schemas";

// Why we use require() instead of import:
// The zod-to-dynamodb-onetable-schema package doesn't have proper ESM support yet
// This is a known issue and matches the pattern used in domain/game-web/src/chat/table.ts
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { zodOneModelSchema } = require("zod-to-dynamodb-onetable-schema");

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
 * OneTable schema for content domain
 *
 * Index configuration must match the SST stack definition in domain/content/stack.ts
 */
const ContentTableSchema = {
  format: "onetable:1.1.0" as const,
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
    gsi1: { hash: "gsi1pk", sort: "gsi1sk", project: "all" },
    gsi2: { hash: "gsi2pk", sort: "gsi2sk", project: "all" },
  },
  models: {
    Character: zodOneModelSchema(CharacterSchema),
    PoolCounter: zodOneModelSchema(PoolCounterSchema),
  },
  params: {
    isoDates: true, // Use ISO date strings
    timestamps: false, // We manage timestamps manually
    typeField: "_type", // OneTable adds this to distinguish entity types
  },
} as const;

/**
 * The content table instance
 *
 * Usage:
 *   // Create
 *   const char = await ContentTable.create('Character', { characterId, name, ... })
 *
 *   // Get by primary key
 *   const char = await ContentTable.get('Character', { characterId })
 *
 *   // Query by index
 *   const available = await ContentTable.find('Character', { recruitmentState: 'available' }, { index: 'gsi1' })
 *   const playerChars = await ContentTable.find('Character', { playerId }, { index: 'gsi2' })
 *
 *   // Scan all
 *   const allChars = await ContentTable.scan('Character')
 */
export const ContentTable = new Table({
  client: docClient,
  name: Resource.ContentTable.name,
  schema: ContentTableSchema,
  partial: false, // We always provide complete objects; no partial updates
  logger: process.env.NODE_ENV === "development" ? console.log : false,
});

/**
 * Type-safe model accessors
 *
 * These give you full TypeScript autocomplete for entity operations
 */
export const CharacterModel = ContentTable.getModel("Character");
export const PoolCounterModel = ContentTable.getModel("PoolCounter");
