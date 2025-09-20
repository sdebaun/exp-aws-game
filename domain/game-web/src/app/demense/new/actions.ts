"use server";

import { auth0 } from "../../../../../../integrations/auth0";
import {
  createStructuredResponse,
  generateImage,
  generateObject,
} from "../../../../../../integrations/openai/openai";
import { DemenseEntity } from "../../../db/entities";
import { db } from "../../../db";
import { nanoid } from "nanoid";
import z from "zod";
import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";

const DemenseParser = z.object({
  name: z.string(),
  description: z.string(),
  aspects: z.array(z.string()),
});

const ExploreDemenseResultParser = z.object({
  demenses: z.array(DemenseParser).length(3),
});

// Types for the expected response structure
type GeneratedDemense = z.infer<typeof DemenseParser>;
type ExploreDemenseResult = z.infer<typeof ExploreDemenseResultParser>;

// Type guard to check if content item has parsed data
function hasParsedContent(item: any): item is { parsed: ExploreDemenseResult } {
  return 'parsed' in item && item.parsed?.demenses?.length === 3;
}

// Type guard to check if content item has text
function hasTextContent(item: any): item is { text: string } {
  return 'text' in item && typeof item.text === 'string';
}

// Extract parsed data from the OpenAI response with proper typing
function extractParsedDemenses(response: any): ExploreDemenseResult {
  // First, check the output array
  if (!response.output || !Array.isArray(response.output) || response.output.length === 0) {
    throw new Error("No output from API");
  }
  
  const outputItem = response.output[0];
  
  // Navigate through the response structure
  if (outputItem.type === 'message' && 'content' in outputItem && Array.isArray(outputItem.content)) {
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
  if ('output_parsed' in response && response.output_parsed) {
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
  console.log("Full response:", response);
  
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
// export async function exploreDemenses() {
//   const session = await auth0.getSession();
//   if (!session) {
//     throw new Error("Not authenticated");
//   }

//   const accountId = session.user.sub;

//   // Exploration always costs 10 ink
//   try {
//     await db.account.spendInk(accountId, 10);
//   } catch (e) {
//     throw new Error("Insufficient Ink to explore demenses");
//   }

//   // Generate 3 demenses in one go
//   const response = await generateObject({
//     // instructions: `You are a stronghold generator for a dark fantasy game.

//     //     Generate exactly 3 unique demenses (strongholds/bases) with these constraints:
//     //     - Dark, gritty tone - these are fortresses in a harsh world
//     //     - Each has unique strategic advantages and disadvantages
//     //     - Defense Power: 1-10 scale (higher = better fortified)
//     //     - Production Rate: 1-10 scale (higher = more resource generation)
//     //     - Special Bonus: A unique strategic advantage (e.g. "Night vision", "Healing springs", "Shadow cloak")
//     //     - Create vivid, cinematic image prompts for imposing fortresses/strongholds
//     //     - Image prompts should be in a painted fantasy art style, dramatic lighting, showing the entire structure`,
//     input: "Generate 3 unique demenses for a player to choose from",
//     response_format: zodResponseFormat(ExploreDemenseResultParser)
//     // text: {
//     //   format: zodTextFormat(
//     //     ExploreDemenseResultParser,
//     //     "explore_demense_result_parser",
//     //   ),
//     // },
//   });

// Parse the result from the response
// const result = response;
// console.log("Full response:", result);
// console.log("Response keys:", Object.keys(result));

// // Check different possible locations for the parsed data
// console.log("response.output_parsed:", response.output_parsed);
// console.log("response.output:", response.output);
// console.log("response.output_text:", response.output_text);

// If still no parsed data, try to get it from the content
// if (!parsed && result.output?.[0]?.type === 'message' && result.output?.[0]?.content) {
//   try {
//     const contentParsed = JSON.parse(result.output[0].content);
//     console.log("Parsed from content:", contentParsed);
//     if (contentParsed && contentParsed.demenses) {
//       return contentParsed.demenses.map((dem: any) => ({
//         name: dem.name,
//         description: dem.description,
//         defensePower: 5,
//         productionRate: 5,
//         specialBonus: dem.aspects?.[0] || "Unknown bonus",
//         imageUrl: null,
//       }));
//     }
//   } catch (e) {
//     console.error("Failed to parse content:", e);
//   }
// }

// if (!parsed || !parsed.demenses) {
//   throw new Error("Failed to generate demenses - no parsed data found");
// }

// // Map the generated demenses to match the expected structure
// return parsed.demenses.map((dem: any) => ({
//   name: dem.name,
//   description: dem.description,
//   defensePower: 5,
//   productionRate: 5,
//   specialBonus: dem.aspects?.[0] || "Unknown bonus",
//   imageUrl: null,
// }));
// }

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
