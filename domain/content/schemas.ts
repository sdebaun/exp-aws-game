/**
 * Zod schemas for content domain entities
 *
 * These schemas serve dual purposes:
 * 1. Runtime validation via Zod
 * 2. OneTable model generation via zod-to-dynamodb-onetable-schema
 *
 * The pk/sk literals use OneTable template syntax: ${fieldName}
 */

import { z } from "zod";

/**
 * Origin schema - matches CharacterGenerationSchema from generator.ts
 *
 * Why we duplicate instead of importing from generator.ts:
 * - Generator uses OpenAI-specific descriptions/constraints
 * - This is the canonical DB schema
 * - Keeps DB schema independent of AI generation concerns
 */
const Origin = z.object({
  type: z.enum(["historical", "fictional"]),
  place: z.string().min(2),
  era: z.string().min(2),
  culture: z.string().min(2),
  canon: z.string().optional(),
  canon_scale: z.enum(["expansive"]).optional(),
  crossover: z.literal("none"),
});

/**
 * Sentinel value for characters not assigned to a player
 *
 * Why a sentinel instead of undefined:
 * - OneTable template strings can't handle undefined/optional values
 * - Allows querying "all available characters" via GSI2
 * - Simplifies schema and application logic
 */
export const UNASSIGNED_PLAYER_ID = "__AVAILABLE__";

/**
 * Character base schema - all game properties (no DynamoDB keys)
 */
export const CharacterBase = z.object({
  characterId: z.string().min(1),

  // Generated properties from OpenAI
  name: z.string().min(2),
  origin: Origin,
  background: z.string().min(1),
  appearance_and_manner: z.string().min(1),
  primary_aspect: z.string().min(1),
  aspects: z.array(z.string()).length(3),
  motivations: z.array(z.string()).length(3),
  fears: z.array(z.string()).length(3),

  portraitUrl: z.string().optional(),

  // State tracking
  recruitmentState: z.enum(["available", "recruitable", "rostered"]),
  playerId: z.string().min(1), // Always set; use UNASSIGNED_PLAYER_ID for available characters

  // Ink economy
  reservationInkSpent: z.number().default(0),
  totalInkSpent: z.number().default(0),

  // Metadata
  generationBatch: z.string().optional(),
  createdAt: z.string().datetime(),
  reservedAt: z.string().datetime().optional(),
  rosteredAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime(),
});

/**
 * Character DynamoDB schema with keys
 *
 * Access patterns:
 * - Get character by ID (primary: pk=CHAR#<id>)
 * - List characters by state (GSI1: gsi1pk=STATE#<state>)
 * - List player's characters (GSI2: gsi2pk=PLAYER#<playerId>)
 * - List all available characters (GSI2: gsi2pk=PLAYER#__AVAILABLE__)
 *
 * Note: playerId always has a value (UNASSIGNED_PLAYER_ID for available characters),
 * so GSI2 is always populated. This simplifies querying.
 */
export const CharacterSchema = CharacterBase.extend({
  pk: z.literal("CHAR#${characterId}"),
  sk: z.literal("LOOKUP"),
  gsi1pk: z.literal("STATE#${recruitmentState}"),
  gsi1sk: z.literal("CREATED#${createdAt}"),
  gsi2pk: z.literal("PLAYER#${playerId}"),
  gsi2sk: z.literal("${recruitmentState}#${createdAt}"),
});

export type Character = z.infer<typeof CharacterBase>;
export type CharacterRecord = z.infer<typeof CharacterSchema>;

/**
 * PoolCounter base schema
 *
 * Tracks available content counts for efficient monitoring
 */
const PoolCounterBase = z.object({
  poolType: z.string().min(1), // "character", "valley", "scenario", etc.
  availableCount: z.number().int().default(0),
  totalGenerated: z.number().int().default(0),
  isGenerating: z.boolean().default(false),
  lastChecked: z.string().datetime().optional(),
  lastGenerated: z.string().datetime().optional(),
  updatedAt: z.string().datetime(),
});

/**
 * PoolCounter DynamoDB schema with keys
 *
 * Access pattern:
 * - Get counter by pool type (primary: pk=POOL_COUNTER, sk=<poolType>)
 */
export const PoolCounterSchema = PoolCounterBase.extend({
  pk: z.literal("POOL_COUNTER"),
  sk: z.literal("${poolType}"),
});

export type PoolCounter = z.infer<typeof PoolCounterBase>;
export type PoolCounterRecord = z.infer<typeof PoolCounterSchema>;

/**
 * State transition validation
 *
 * Why this lives here instead of entity.ts:
 * - Pure business logic, no DB coupling
 * - Used by both DB layer and application layer
 */
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

/**
 * Ink costs configuration
 */
export const CharacterInkCosts = {
  RESERVATION: 10, // Cost to move from available to recruitable
  ROSTER: 50, // Cost to move from recruitable to rostered
  DISMISSAL_REFUND_RATE: 0.5, // 50% refund on dismissal
} as const;

/**
 * Pool management configuration
 */
export const PoolConfig = {
  MINIMUM_AVAILABLE: 50, // Target minimum for available pool
  GENERATION_BATCH_SIZE: 5, // Characters to generate per batch
  CHECK_INTERVAL_MINUTES: 1, // Check every minute
} as const;
