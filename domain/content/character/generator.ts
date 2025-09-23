import { generateStructuredResponse, generateImage } from "../../../integrations/openai";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod.mjs";

const CharacterParser = z.object({
  name: z.string(),
  origin: z.string().describe("Cultural or ethnic background - can be real (Yoruba, Bengali, Sámi, etc.) or fictional but specific"),
  description: z.string().describe("A vivid description in MARKDOWN format with paragraphs, **bold** for emphasis, and *italics* for flavor. Use line breaks between paragraphs."),
  aspects: z.array(z.string()).min(1).max(3).describe("1-3 short phrases describing key traits, skills, or defining characteristics"),
  appearance: z.string().describe("Physical appearance including skin tone, features, and style influenced by their origin"),
});

/**
 * Generates a new character for the available pool.
 * Based on the existing character generation in game-web but adapted for pool characters.
 */
export async function generateCharacter() {
  const characterId = uuidv4();
  
  const instructions = `You are a character generator in the style of Terry Pratchett meets China Miéville. 
        
Generate a unique character following these STRICT rules:
- DIVERSITY IS MANDATORY: Generate characters from varied ethnic and cultural backgrounds from across human history and imagination
- Origin can be real (Igbo, Tamil, Mongolian, Ainu, Quechua, etc.) or fictional but must be specific
- Write with dry wit, subtle absurdity, and keen observation of human nature
- Create characters who are fundamentally human despite any fantastical elements
- Their flaws should be amusing, relatable, or poignant - not just "dark and brooding"
- Include 1-3 defining aspects that are specific and memorable (not generic fantasy tropes)
- Appearance must reflect their origin authentically - skin tone, features, traditional elements
- NEVER mention the setting name or world name in the description
- Make them feel like real people with real problems, just in extraordinary circumstances

IMPORTANT FORMATTING:
- The description MUST use Markdown formatting
- Use multiple paragraphs with blank lines between them
- Use **bold** for important character traits or key moments
- Use *italics* for internal thoughts or subtle observations
- Make it visually easy to scan and read`;

  const input = "Generate a character who could have walked out of a Terry Pratchett novel into a weirder universe";

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
    const portraitPrompt = `Realistic portrait photograph of ${character.name}, a person of ${character.origin} origin: ${character.appearance}. Style: candid documentary photography, natural lighting, unposed. This is a REAL PERSON of ${character.origin} heritage - show authentic ethnic features and skin tone. Could be ugly, beautiful, plain, or interesting-looking. Show genuine human diversity, real faces with imperfections and character. Natural skin texture, real body types. IMPORTANT: Absolutely NO text, NO writing, NO letters, NO words anywhere in the image. Pure photographic portrait only.`;

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
    origin: character.origin,
    description: character.description,
    aspects: character.aspects,
    portraitUrl,
    recruitmentState: "available" as const,
    generationBatch: new Date().toISOString(),
  };
}