// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../sst-env.d.ts" />

import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

// DynamoDB client
export const dynamoClient = new DynamoDBClient({});

// Pool Counter entity - tracks available content count for efficient monitoring
export const PoolCounterEntity = new Entity({
  model: {
    entity: "poolCounter",
    version: "1",
    service: "content",
  },
  attributes: {
    poolType: { type: "string", required: true }, // "character", "valley", "scenario", etc.
    availableCount: { type: "number", default: 0, required: true },
    totalGenerated: { type: "number", default: 0, required: true },
    isGenerating: { type: "boolean", default: false, required: true },
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
      sk: { field: "sk", composite: ["poolType"] },
    },
  },
}, {
  client: dynamoClient,
  table: Resource.ContentTable.name,
});