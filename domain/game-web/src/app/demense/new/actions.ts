"use server";

import { auth0 } from "../../../../../../integrations/auth0";
import {
  generateImage,
  generateWithFunction,
} from "../../../../../../integrations/openai";
import { DemenseEntity } from "../../../db/entities";
import { nanoid } from "nanoid";

type GeneratedDemense = {
  name: string;
  description: string;
  defensePower: number;
  productionRate: number;
  specialBonus: string;
  imagePrompt: string;
};

type DemenseSet = {
  demenses: GeneratedDemense[];
};

export async function generateDemenses() {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  // Generate 3 demenses in one go
  const result = await generateWithFunction<DemenseSet>({
    messages: [
      {
        role: "system",
        content: `You are a stronghold generator for a dark fantasy game. 
        
        Generate exactly 3 unique demenses (strongholds/bases) with these constraints:
        - Dark, gritty tone - these are fortresses in a harsh world
        - Each has unique strategic advantages and disadvantages
        - Defense Power: 1-10 scale (higher = better fortified)
        - Production Rate: 1-10 scale (higher = more resource generation)
        - Special Bonus: A unique strategic advantage (e.g. "Night vision", "Healing springs", "Shadow cloak")
        - Create vivid, cinematic image prompts for imposing fortresses/strongholds
        - Image prompts should be in a painted fantasy art style, dramatic lighting, showing the entire structure`,
      },
      {
        role: "user",
        content: "Generate 3 unique demenses for a player to choose from",
      },
    ],
    functionDef: {
      name: "create_demenses",
      description: "Create multiple demenses with details and image prompts",
      parameters: {
        type: "object",
        properties: {
          demenses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                defensePower: { type: "number", minimum: 1, maximum: 10 },
                productionRate: { type: "number", minimum: 1, maximum: 10 },
                specialBonus: { type: "string" },
                imagePrompt: { type: "string" },
              },
              required: ["name", "description", "defensePower", "productionRate", "specialBonus", "imagePrompt"],
            },
          },
        },
        required: ["demenses"],
      },
    },
  });

  // Generate images for all 3 demenses in parallel
  const demensesWithImages = await Promise.all(
    result.demenses.map(async (dem) => {
      try {
        const imageUrl = await generateImage({ 
          prompt: dem.imagePrompt,
          size: "1792x1024" // Wide aspect ratio for strongholds
        });
        return { ...dem, imageUrl };
      } catch (e) {
        console.error(`Failed to generate image for ${dem.name}:`, e);
        return { ...dem, imageUrl: null };
      }
    }),
  );

  return demensesWithImages;
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

  // TODO: Save the image URL somewhere permanent (S3/R2) before it expires

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