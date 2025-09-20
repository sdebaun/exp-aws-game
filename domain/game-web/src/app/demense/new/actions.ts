"use server";

import { auth0 } from "@integrations/auth0";
import {
  generateImage,
  generateStructuredResponse,
} from "@integrations/openai";
import { DemenseEntity } from "../../../db/entities";
import { db } from "../../../db";
import { nanoid } from "nanoid";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod.mjs";

const DemenseParser = z.object({
  name: z.string(),
  description: z.string(),
  aspects: z.array(z.string()).length(3),
});

const ExploreDemenseResultParser = z.object({
  demenses: z.array(DemenseParser).length(1),
}).strict();

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

  const instructions =
    `You are a stronghold generator for a dark fantasy game. Generate exactly 3 unique demenses (strongholds/bases) with these constraints:
- Dark, gritty tone - these are fortresses in a harsh world
- Each has unique strategic advantages and aspects
- Each demense should have 2-3 aspects that describe its characteristics`;

  const input = "Generate 3 unique demenses for a player to choose from";

  const format = zodTextFormat(
    ExploreDemenseResultParser,
    "explore_demense_result_parser",
  );

  const response = await generateStructuredResponse({
    format,
    instructions,
    input,
  });

  console.log("demense response", response.output_parsed);

  // The parse method should give us the parsed data directly
  if (!response.output_parsed) {
    throw new Error("Failed to generate demenses");
  }

  const parsedResult = response.output_parsed;

  // Generate portraits for each demense in parallel
  const demensesWithPortraits = await Promise.all(
    parsedResult.demenses.map(async (dem) => {
      try {
        // Create a detailed prompt for portrait generation
        const portraitPrompt =
          `Dark fantasy stronghold portrait: ${dem.name}. ${dem.description}. Key features: ${
            dem.aspects.join(", ")
          }. Style: gothic, foreboding, medieval fortress, atmospheric lighting, dramatic perspective.`;

        // Generate the portrait
        const imageResult = await generateImage({
          prompt: portraitPrompt,
          // textContent: dem.description,
          // model: "dall-e-3",
          size: "1024x1024",
          // quality: "standard",
          style: "vivid",
        });

        return {
          name: dem.name,
          description: dem.description,
          defensePower: 5, // Default values for now
          productionRate: 5,
          specialBonus: dem.aspects?.[0] || "Unknown bonus",
          imageUrl: imageResult.url || null,
        };
      } catch (error) {
        console.error(`Failed to generate portrait for ${dem.name}:`, error);
        // Return demense without portrait if generation fails
        return {
          name: dem.name,
          description: dem.description,
          defensePower: 5,
          productionRate: 5,
          specialBonus: dem.aspects?.[0] || "Unknown bonus",
          imageUrl: null,
        };
      }
    }),
  );

  return demensesWithPortraits;
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
