import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Entity, Service } from "electrodb";
import { Resource } from "sst";

// DynamoDB client
export const dynamoClient = new DynamoDBClient({});

// Account entity - tracks game accounts and Ink currency
export const AccountEntity = new Entity({
  model: {
    entity: "account",
    version: "1",
    service: "game",
  },
  attributes: {
    accountId: { type: "string", required: true }, // auth0 user.sub
    ink: { type: "number", default: 100 }, // starter ink amount
    subscription: {
      type: ["free", "paid"] as const,
      default: "free",
    },
    dailyInkRate: { type: "number", default: 5 }, // free tier daily ink
    lastInkGrant: { type: "string" }, // ISO timestamp of last daily grant
    createdAt: {
      type: "string",
      default: () => new Date().toISOString(),
      readOnly: true,
    },
    updatedAt: {
      type: "string",
      watch: "*",
      set: () => new Date().toISOString(),
      readOnly: true,
    },
  },
  indexes: {
    primary: {
      pk: { field: "pk", composite: ["accountId"] },
      sk: { field: "sk", composite: [] },
    },
  },
}, {
  client: dynamoClient,
  table: Resource.GameTable.name,
});

// Character entity - all characters (available, recruitable, rostered)
export const CharacterEntity = new Entity({
  model: {
    entity: "character",
    version: "1",
    service: "game",
  },
  attributes: {
    characterId: { type: "string", required: true },
    name: { type: "string", required: true },
    description: { type: "string", required: true },
    aspects: { type: "list", items: { type: "string" }, required: true },
    portraitUrl: { type: "string" },
    // Recruitment state tracking
    recruitmentState: {
      type: ["available", "recruitable", "rostered"] as const,
      required: true,
    },
    // Player association (null for available characters)
    playerId: { type: "string" },
    // Ink tracking
    reservationInkSpent: { type: "number", default: 0 },
    totalInkSpent: { type: "number", default: 0 },
    // Timestamps
    createdAt: {
      type: "string",
      default: () => new Date().toISOString(),
      readOnly: true,
    },
    reservedAt: { type: "string" },
    rosteredAt: { type: "string" },
    updatedAt: {
      type: "string",
      watch: "*",
      set: () => new Date().toISOString(),
      readOnly: true,
    },
  },
  indexes: {
    primary: {
      pk: { field: "pk", composite: ["characterId"] },
      sk: { field: "sk", composite: [] },
    },
    // GSI1 for listing characters by state
    byState: {
      index: "gsi1",
      pk: { field: "gsi1pk", composite: ["recruitmentState"] },
      sk: { field: "gsi1sk", composite: ["createdAt"] },
    },
    // GSI2 for player's characters
    byPlayer: {
      index: "gsi2",
      pk: { field: "gsi2pk", composite: ["playerId"] },
      sk: { field: "gsi2sk", composite: ["recruitmentState", "createdAt"] },
      condition: (attr) => attr.playerId !== undefined,
    },
  },
}, {
  client: dynamoClient,
  table: Resource.GameTable.name,
});

// Pool Counter entity - tracks available character count for efficient monitoring
export const PoolCounterEntity = new Entity({
  model: {
    entity: "poolCounter",
    version: "1",
    service: "game",
  },
  attributes: {
    counterId: { type: "string", default: "MAIN", required: true },
    availableCount: { type: "number", default: 0, required: true },
    totalGenerated: { type: "number", default: 0, required: true },
    lastChecked: { type: "string" },
    lastGenerated: { type: "string" },
    updatedAt: {
      type: "string",
      watch: "*",
      set: () => new Date().toISOString(),
      readOnly: true,
    },
  },
  indexes: {
    primary: {
      pk: { field: "pk", composite: [], template: "POOL_COUNTER" },
      sk: { field: "sk", composite: ["counterId"] },
    },
  },
}, {
  client: dynamoClient,
  table: Resource.GameTable.name,
});

// Service combines all entities for cross-entity operations
export const GameService = new Service({
  account: AccountEntity,
  character: CharacterEntity,
  poolCounter: PoolCounterEntity,
}, { client: dynamoClient, table: Resource.GameTable.name });
