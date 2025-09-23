import { generateStructuredResponse, generateImage } from "@/integrations/openai";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod.mjs";

const CharacterParser = z.object({
  name: z.string(),
  description: z.string().describe("A vivid description of the character's personality and background"),
  aspects: z.array(z.string()).min(1).max(3).describe("Key character traits or abilities"),
  appearance: z.string().describe("Physical appearance for portrait generation"),
});

/**
 * Generates a new character for the available pool.
 * Based on the existing character generation in game-web but adapted for pool characters.
 */
export async function generateCharacter() {
  const characterId = uuidv4();
  
  const instructions = `You are a character generator for a dark fantasy game.
        
Generate a unique character with these constraints:
- Dark, gritty tone with morally complex characters
- Each character has a rich background and distinct personality
- Include 1-3 defining aspects (traits, abilities, or characteristics)
- Appearance should be detailed enough for portrait generation`;

  const input = "Generate a compelling character for the recruitment pool";

  const format = zodTextFormat(CharacterParser, "character_parser");

  const response = await generateStructuredResponse({
    format,
    instructions,
    input,
  });

  if (!response.output_parsed) {
    throw new Error("Failed to generate character");
  }

  const character = response.output_parsed;

  // Generate portrait
  let portraitUrl: string | undefined;
  try {
    const portraitPrompt = `Dark fantasy character portrait: ${character.name}. ${character.appearance}. ${character.description}. Style: painted fantasy art, dramatic lighting, weathered and battle-scarred.`;

    const imageResult = await generateImage({
      prompt: portraitPrompt,
      size: "1024x1024",
      style: "vivid",
    });

    portraitUrl = imageResult.url || undefined;
  } catch (e) {
    console.error(`Failed to generate portrait for ${character.name}:`, e);
  }

  return {
    characterId,
    name: character.name,
    description: character.description,
    aspects: character.aspects,
    portraitUrl,
    recruitmentState: "available" as const,
    generationBatch: new Date().toISOString(),
  };
}