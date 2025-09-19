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
      default: "free" 
    },
    dailyInkRate: { type: "number", default: 5 }, // free tier daily ink
    lastInkGrant: { type: "string" }, // ISO timestamp of last daily grant
    createdAt: { 
      type: "string", 
      default: () => new Date().toISOString(),
      readOnly: true 
    },
    updatedAt: {
      type: "string",
      watch: "*",
      set: () => new Date().toISOString(),
      readOnly: true
    }
  },
  indexes: {
    primary: {
      pk: { field: "pk", composite: ["accountId"] },
      sk: { field: "sk", composite: [] },
    },
  },
}, { 
  client: dynamoClient, 
  table: Resource.GameTable.name 
});

// Character entity - player-created characters
export const CharacterEntity = new Entity({
  model: {
    entity: "character",
    version: "1", 
    service: "game",
  },
  attributes: {
    accountId: { type: "string", required: true },
    characterId: { type: "string", required: true },
    name: { type: "string", required: true },
    class: { type: "string", required: true },
    background: { type: "string", required: true },
    trait: { type: "string", required: true },
    portrait: { type: "string" }, // URL to generated portrait
    status: {
      type: ["active", "retired", "in_story"] as const,
      default: "active"
    },
    createdAt: {
      type: "string",
      default: () => new Date().toISOString(),
      readOnly: true
    }
  },
  indexes: {
    primary: {
      pk: { field: "pk", composite: ["accountId"] },
      sk: { field: "sk", composite: ["characterId"] },
    },
    // GSI for finding available characters for story matching
    byStatus: {
      index: "gsi1",
      pk: { field: "gsi1pk", composite: ["status"] },
      sk: { field: "gsi1sk", composite: ["createdAt"] },
    }
  },
}, { 
  client: dynamoClient, 
  table: Resource.GameTable.name 
});

// Service combines all entities for cross-entity operations
export const GameService = new Service({
  account: AccountEntity,
  character: CharacterEntity,
}, { client: dynamoClient, table: Resource.GameTable.name });