"use server";

import { auth0 } from "../../../../../../integrations/auth0";
import {
  generateImage,
  generateWithFunction,
} from "../../../../../../integrations/openai";
import { db } from "../../../db/index";
import { nanoid } from "nanoid";

type GeneratedCharacter = {
  name: string;
  class: string;
  background: string;
  trait: string;
  imagePrompt: string;
};

type CharacterSet = {
  characters: GeneratedCharacter[];
};

export async function generateCharacters(freeReroll: boolean = false) {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const accountId = session.user.sub;

  // Check/spend Ink if not a free reroll
  if (!freeReroll) {
    const REROLL_COST = 10; // Or whatever you decide
    try {
      await db.account.spendInk(accountId, REROLL_COST);
    } catch (e) {
      throw new Error("Insufficient Ink for reroll");
    }
  }

  // Generate 3 characters in one go
  const result = await generateWithFunction<CharacterSet>({
    messages: [
      {
        role: "system",
        content: `You are a character generator for a dark fantasy game. 
        
        Generate exactly 3 unique characters with these constraints:
        - Classes: Fighter, Rogue, Wizard, Cleric, Ranger, Warlock
        - Dark, gritty tone with morally gray characters
        - Each character has a tragic or compromising background
        - Each character has a distinctive flaw or quirk
        - Create vivid, cinematic image prompts focusing on weathered, battle-scarred appearances
        - Image prompts should be in a painted fantasy art style, dramatic lighting`,
      },
      {
        role: "user",
        content: "Generate 3 unique characters for a player to choose from",
      },
    ],
    functionDef: {
      name: "create_characters",
      description: "Create multiple characters with details and image prompts",
      parameters: {
        type: "object",
        properties: {
          characters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                class: {
                  type: "string",
                  enum: [
                    "Fighter",
                    "Rogue",
                    "Wizard",
                    "Cleric",
                    "Ranger",
                    "Warlock",
                  ],
                },
                background: { type: "string" },
                trait: { type: "string" },
                imagePrompt: { type: "string" },
              },
              required: ["name", "class", "background", "trait", "imagePrompt"],
            },
          },
        },
        required: ["characters"],
      },
    },
  });

  // Generate images for all 3 characters in parallel
  const charactersWithImages = await Promise.all(
    result.characters.map(async (char) => {
      try {
        const imageUrl = await generateImage({ prompt: char.imagePrompt });
        return { ...char, imageUrl };
      } catch (e) {
        console.error(`Failed to generate image for ${char.name}:`, e);
        return { ...char, imageUrl: null };
      }
    }),
  );

  return charactersWithImages;
}

export async function selectCharacter(character: {
  name: string;
  class: string;
  background: string;
  trait: string;
  imageUrl?: string | null;
}) {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const accountId = session.user.sub;
  const characterId = nanoid();

  // TODO: Save the image URL somewhere permanent (S3/R2) before it expires

  await db.character.create(accountId, {
    characterId,
    name: character.name,
    class: character.class,
    background: character.background,
    trait: character.trait,
    portrait: character.imageUrl || undefined,
  });

  return { characterId };
}
