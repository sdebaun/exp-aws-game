"use server";

import { auth0 } from "../../../../../../integrations/auth0";
import {
  createStructuredResponse,
  generateImage,
} from "../../../../../../integrations/openai/openai";
import { db } from "../../../db/index";
import { nanoid } from "nanoid";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod.mjs";

const CharacterParser = z.object({
  name: z.string(),
  class: z.enum(["Fighter", "Rogue", "Wizard", "Cleric", "Ranger", "Warlock"]),
  background: z.string(),
  trait: z.string(),
  appearance: z.string(),
});

const GenerateCharactersResultParser = z.object({
  characters: z.array(CharacterParser).length(3),
}).strict();

export async function generateCharacters(freeReroll: boolean = false) {
  const session = await auth0.getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const accountId = session.user.sub;

  // Check/spend Ink if not a free reroll
  if (!freeReroll) {
    const REROLL_COST = 10;
    try {
      await db.account.spendInk(accountId, REROLL_COST);
    } catch (e) {
      throw new Error("Insufficient Ink for reroll");
    }
  }

  const instructions = `You are a character generator for a dark fantasy game. 
        
Generate exactly 3 unique characters with these constraints:
- Classes must be one of: Fighter, Rogue, Wizard, Cleric, Ranger, Warlock
- Dark, gritty tone with morally gray characters
- Each character has a tragic or compromising background
- Each character has a distinctive flaw or quirk
- Appearance should describe weathered, battle-scarred looks suitable for character portraits`;

  const input = "Generate 3 unique characters for a player to choose from";

  const format = zodTextFormat(
    GenerateCharactersResultParser,
    "generate_characters_result_parser",
  );

  const response = await createStructuredResponse({
    format,
    instructions,
    input,
  });

  // The parse method should give us the parsed data directly
  if (!response.output_parsed) {
    throw new Error("Failed to generate characters");
  }
  
  const parsedResult = response.output_parsed;

  // Generate portraits for each character in parallel
  const charactersWithImages = await Promise.all(
    parsedResult.characters.map(async (char) => {
      try {
        // Create a detailed prompt for portrait generation
        const portraitPrompt = `Dark fantasy character portrait: ${char.name}, ${char.class}. ${char.appearance}. Background: ${char.background}. Style: painted fantasy art, dramatic lighting, weathered and battle-scarred.`;
        
        // Generate the portrait
        const imageResult = await generateImage({
          prompt: portraitPrompt,
          model: "dall-e-3",
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        });

        return {
          ...char,
          imageUrl: imageResult.url || null,
        };
      } catch (e) {
        console.error(`Failed to generate portrait for ${char.name}:`, e);
        return {
          ...char,
          imageUrl: null,
        };
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
