// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../sst-env.d.ts" />

import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

// DynamoDB client
export const dynamoClient = new DynamoDBClient({});

// Character entity - all characters (available, recruitable, rostered)
export const CharacterEntity = new Entity({
  model: {
    entity: "character",
    version: "1",
    service: "content",
  },
  attributes: {
    characterId: { type: "string", required: true },

    // generated properties from CharacterGenerationSchema
    name: { type: "string", required: true },

    // Origin as nested map matching CharacterGenerationSchema
    origin: {
      type: "map",
      properties: {
        type: { type: ["historical", "fictional"] as const, required: true },
        place: { type: "string", required: true },
        era: { type: "string", required: true },
        culture: { type: "string", required: true },
        canon: { type: "string" },
        canon_scale: { type: ["expansive"] as const },
        crossover: { type: "string", required: true },
      },
      required: true,
    },

    background: { type: "string", required: true },
    appearance_and_manner: { type: "string", required: true },
    primary_aspect: { type: "string", required: true },
    aspects: { type: "list", items: { type: "string" }, required: true },
    motivations: { type: "list", items: { type: "string" }, required: true },
    fears: { type: "list", items: { type: "string" }, required: true },

    portraitUrl: { type: "string" },

    // non-generated state tracking
    recruitmentState: {
      type: ["available", "recruitable", "rostered"] as const,
      required: true,
    },

    playerId: { type: "string" },

    reservationInkSpent: { type: "number", default: 0 },
    totalInkSpent: { type: "number", default: 0 },

    generationBatch: { type: "string" },

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
      condition: (attr) => attr.playerId !== undefined && attr.playerId !== "",
    },
  },
}, {
  client: dynamoClient,
  table: Resource.ContentTable.name,
});

// State transition validation
export function canTransitionState(
  from: "available" | "recruitable" | "rostered",
  to: "available" | "recruitable" | "rostered",
): boolean {
  const validTransitions: Record<string, string[]> = {
    available: ["recruitable"],
    recruitable: ["rostered", "available"], // Can dismiss back to available
    rostered: [], // No transitions from rostered
  };

  return validTransitions[from]?.includes(to) ?? false;
}

// Ink costs configuration
export const CharacterInkCosts = {
  RESERVATION: 10, // Cost to move from available to recruitable
  ROSTER: 50, // Cost to move from recruitable to rostered
  DISMISSAL_REFUND_RATE: 0.5, // 50% refund on dismissal
} as const;

// Pool management configuration
export const PoolConfig = {
  MINIMUM_AVAILABLE: 50, // Target minimum for available pool
  GENERATION_BATCH_SIZE: 5, // Characters to generate per batch
  CHECK_INTERVAL_MINUTES: 1, // Check every minute
} as const;
