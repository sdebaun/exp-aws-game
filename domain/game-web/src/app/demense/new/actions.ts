"use server";

import { auth0 } from "../../../../../../integrations/auth0";
import {
  createStructuredResponse,
} from "../../../../../../integrations/openai/openai";
import type { Response } from "openai/resources/responses/responses";
import { DemenseEntity } from "../../../db/entities";
import { db } from "../../../db";
import { nanoid } from "nanoid";
import z from "zod";

const DemenseParser = z.object({
  name: z.string(),
  description: z.string(),
  aspects: z.array(z.string()),
});

const ExploreDemenseResultParser = z.object({
  demenses: z.array(DemenseParser).length(3),
});

// Types for the expected response structure
type ExploreDemenseResult = z.infer<typeof ExploreDemenseResultParser>;

// Type guard to check if content item has parsed data
function hasParsedContent(
  item: unknown,
): item is { parsed: ExploreDemenseResult } {
  return (
    typeof item === "object" &&
    item !== null &&
    "parsed" in item &&
    item.parsed !== null &&
    typeof item.parsed === "object" &&
    "demenses" in item.parsed &&
    Array.isArray(item.parsed.demenses) &&
    item.parsed.demenses.length === 3
  );
}

// Type guard to check if content item has text
function hasTextContent(item: unknown): item is { text: string } {
  return (
    typeof item === "object" &&
    item !== null &&
    "text" in item &&
    typeof item.text === "string"
  );
}

// Extract parsed data from the OpenAI response with proper typing
function extractParsedDemenses(response: Response): ExploreDemenseResult {
  // First, check the output array
  if (
    !response.output || !Array.isArray(response.output) ||
    response.output.length === 0
  ) {
    throw new Error("No output from API");
  }

  const outputItem = response.output[0];

  // Navigate through the response structure
  if (
    outputItem.type === "message" && "content" in outputItem &&
    Array.isArray(outputItem.content)
  ) {
    const contentItem = outputItem.content[0];

    // Check for parsed data first (preferred)
    if (hasParsedContent(contentItem)) {
      return contentItem.parsed;
    }

    // Fall back to parsing text if available
    if (hasTextContent(contentItem)) {
      try {
        const parsed = JSON.parse(contentItem.text);
        // Validate the parsed data matches our schema
        return ExploreDemenseResultParser.parse(parsed);
      } catch (e) {
        console.error("Failed to parse output text:", e);
        console.error("Text was:", contentItem.text);
        throw new Error("Failed to parse demenses response");
      }
    }
  }

  // Last resort: check for output_parsed at the top level
  if ("output_parsed" in response && response.output_parsed) {
    return ExploreDemenseResultParser.parse(response.output_parsed);
  }

  throw new Error("Failed to extract demenses from API response");
}

export async function exploreDemenses() {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const accountId = session.user.sub;

  // Exploration always costs 10 ink
  try {
    await db.account.spendInk(accountId, 10);
  } catch (e) {
    throw new Error("Insufficient Ink to explore demenses");
  }

  const response = await createStructuredResponse();

  // Extract and validate the parsed demenses
  const parsedResult = extractParsedDemenses(response);

  // Map the generated demenses to match the expected structure
  return parsedResult.demenses.map((dem) => ({
    name: dem.name,
    description: dem.description,
    defensePower: 5, // Default values for now
    productionRate: 5,
    specialBonus: dem.aspects?.[0] || "Unknown bonus",
    imageUrl: null,
  }));
}

export async function selectDemense(demense: {
  name: string;
  description: string;
  defensePower: number;
  productionRate: number;
  specialBonus: string;
  imageUrl?: string | null;
}) {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const accountId = session.user.sub;
  const demenseId = nanoid();

  // Delete any existing demense for this account
  const existing = await DemenseEntity.query
    .primary({ accountId })
    .go();

  for (const oldDemense of existing.data) {
    await DemenseEntity.delete({
      accountId,
      demenseId: oldDemense.demenseId,
    }).go();
  }

  // TODO: Save the image URL somewhere permanent (S3/R2) before it expires

  // Create the new demense
  await DemenseEntity.create({
    accountId,
    demenseId,
    name: demense.name,
    description: demense.description,
    defensePower: demense.defensePower,
    productionRate: demense.productionRate,
    specialBonus: demense.specialBonus,
    imageUrl: demense.imageUrl || undefined,
  }).go();

  return { demenseId };
}
