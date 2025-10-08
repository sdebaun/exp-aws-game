import {
  generateImage,
  generateStructuredResponse,
} from "../../../integrations/openai";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod.mjs";

/**
 * Origin must be either:
 * - historical: explicit place, era, culture
 * - fictional: explicit CANON name from an expansive, multi-work universe
 *   (standalone works are disallowed) with no crossovers
 * Both share display properties for consistent rendering.
 */
const Origin = z.object({
  type: z.enum(["historical", "fictional"]),
  place: z
    .string()
    .min(2)
    .describe(
      "Specific geography — historical or fictional (e.g., 'Mali Empire, Niger River valley' [historical]; 'Arrakeen, Arrakis' [fictional]).",
    ),
  era: z
    .string()
    .min(2)
    .describe(
      "Specific time period — historical or fictional (e.g., '14th century CE' [historical]; 'Federation 24th century' or 'Reign of Muad’Dib' [fictional]).",
    ),
  culture: z
    .string()
    .min(2)
    .describe(
      "Cultural, ethnic, or canonical identity — historical or fictional (e.g., 'Mande traders' [historical]; 'Federation officer' or 'Ankh-Morpork guild clerk' [fictional]).",
    ),
  canon: z
    .string()
    .optional()
    .nullable()
    .describe(
      "For fictional origins only: named, published canon from a large multi-work universe (e.g., 'Star Trek', 'Discworld', 'The Culture').",
    ),
  canon_scale: z
    .enum(["expansive"])
    .optional()
    .nullable()
    .describe(
      "Fictional canons must be expansive (multi-work). Single-work or standalone stories are not allowed.",
    ),
  crossover: z
    .literal("none")
    .describe(
      "Must always be 'none'. Crossovers or blended origins are not permitted.",
    ),
});

export const CharacterGenerationSchema = z.object({
  name: z.string().min(2).describe(
    "Character name. Must fit the historical or fictional culture as well as the primary aspect.",
  ),

  origin: Origin.describe(
    "Origin details. Must specify place, era, and culture. If fictional, must name a large multi-work canon; no crossovers or invented universes.",
  ),

  background: z
    .string()
    .min(40)
    .describe(
      "A concise summary of the character’s life and circumstances *before awakening in the River of Souls*. Describe who they were, what they did, and what defined their existence in their original world. Evoke their worldview, struggles, and tone of life as it was then.",
    ),

  appearance_and_manner: z
    .string()
    .min(20)
    .describe(
      "Physical traits + behavior true to origin. Include one memorable sensory or behavioral detail (smell, sound, gesture, habit).",
    ),

  primary_aspect: z
    .string()
    .min(5)
    .describe(
      "A single FATE-style High Concept summarizing the character’s essence (e.g., 'Desert Prophet of Arrakis' [fictional]; 'Sámi Shaman Turned Soviet Soldier' [historical]; 'Cleric of the Omnissiah, Questioning the Machine God' [fictional]; 'Disillusioned Knight of the Fourth Crusade' [historical]).",
    ),

  aspects: z
    .array(
      z
        .string()
        .min(3)
        .describe(
          "Double-edged FATE-style aspect (strength that also causes trouble).",
        ),
    )
    .length(3)
    .describe(
      "Exactly 3 supporting aspects, specific and memorable (avoid generic tropes).",
    ),

  motivations: z
    .array(z.string().min(3))
    .length(3)
    .describe(
      "Exactly 3 intimate, human-scale desires (love, belonging, curiosity, redemption, safety).",
    ),

  fears: z
    .array(z.string().min(3))
    .length(3)
    .describe("Exactly 3 meaningful fears that would shake their identity."),

  constraints_ack: z
    .literal("no_crossovers;no_single_work_canons;no_invented_universes")
    .optional()
    .nullable()
    .describe(
      "Echo back constraints to self-check generation (optional, for model guidance).",
    ),
});

/**
 * Generates a new character for the available pool.
 * Based on the existing character generation in game-web but adapted for pool characters.
 */
export async function generateCharacter() {
  const characterId = uuidv4();

  const instructions = `

Generate a **unique character** for *The River of Souls* — a world where every being who ever lived, real or fictional, awakens beside an endless river at the end of time. They are confused, naked, and very much alive. Write with the dry, humane wit of **Pratchett**, **Banks**, and **Adams**, where absurdity meets melancholy and the human condition is both tragic and hilarious.

### What to Include

**Background** — A concise summary of the character’s life and circumstances *before awakening in the River of Souls*. Describe who they were, what they did, and what defined their existence in their original world. Write in a way that evokes their worldview, struggles, and tone of life as it was then.

**Origin** — Create a coherent and internally consistent origin with the following properties:

* **Type:** Historical or fictional.
* **Place:** Specific geography — historical or fictional (including but not limited to: *Mali Empire, Niger River valley*; *Arrakeen, Arrakis*). Ensure that the place aligns logically with the chosen era and culture.
* **Era:** Specific time period — historical or fictional (including but not limited to: *14th century CE*; *Federation 24th century*). Use recognizable human time frames such as centuries, dynasties, or cultural eras rather than vague descriptors.
* **Culture:** Cultural, ethnic, or canonical identity (including but not limited to: *Mande traders*; *Federation officer*; *Ankh-Morpork guild clerk*). The culture should plausibly exist within the selected place and era, with consistent values, language, and worldview.
* **Canon (if fictional):** Must come from a **large, published canon** with many works or adaptations (including but not limited to: *Star Trek*, *Discworld*, *The Culture*, *Dune*, *Doctor Who*, *Warhammer 40K*). Ensure the canon’s tone and metaphysics are consistent throughout the character.
* **Do not** use single stories, myths, or standalone novels.
* **Do not** invent new universes or species.
* **Variety directive:** Ensure diversity across eras and regions. Do not cluster characters in the same century, continent, or cultural context — draw broadly across human history and major fictional worlds.

**Appearance & Manner** — Describe physical traits and behavior true to origin. Include one vivid sensory or behavioral detail (e.g., smell, sound, or habitual gesture). These details should feel grounded in their place, era, and culture.

**Primary Aspect** — A single FATE-style High Concept summarizing the character’s essence (e.g., *Desert Prophet of Arrakis*; *Sámi Shaman Turned Soviet Soldier*; *Cleric of the Omnissiah, Questioning the Machine God*; *Disillusioned Knight of the Fourth Crusade*). This should reflect their origin’s worldview and personal contradictions.

**Aspects** — Three double-edged descriptors that expand on the Primary Aspect, each being both strength and flaw (*e.g.*, “Knows the Right Thing to Do — and Does It Loudly”). These should all align with their background and internal logic.

**Motivations** — Three intimate, human-scale desires (*love, belonging, curiosity, redemption, safety*). Keep them personal, not epic.

**Fears** — Three things that would shake their sense of self.

### Style & Constraints

* Write as if a dryly amused anthropologist were observing them.
* Be **specific and grounded**; favor cultural authenticity over archetype or trope.
* Ensure **internal consistency** — all parts of the character (origin, manner, aspects, motivations, and fears) should feel like they emerge naturally from the same person and worldview.
* Reflect the **mindset of their origin** — a 10th-century Viking should not think in modern metaphors; a Culture citizen should not sound medieval.
* Characters should feel **alive, funny, and tragic**.
* Never mention *simulation* or *River of Souls* — they have no meta-awareness.
* Stay consistent with their canon’s tone and logic.
* **No crossovers.** Each belongs wholly to their world.
* When uncertain, **err toward realism**, not invention.

### Formatting

Use **Markdown** with bold and italics for clarity.

**Tone example:**

> He had the eyes of a man who’d seen too much bureaucracy to believe in gods, but still prayed before opening a form.

`;

  const input = "Generate a character according to the instructions";

  const format = zodTextFormat(CharacterGenerationSchema, "character_parser");

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
    const portraitPrompt = `
Realistic portrait photograph of ${character.name},
a person of ${character.origin} origin.
${character.appearance_and_manner}.
Style: candid documentary photography, natural lighting, unposed.
This is a REAL PERSON of ${character.origin} heritage - show authentic ethnic features and skin tone. Could be ugly, beautiful, plain, or interesting-looking. Show genuine human diversity, real faces with imperfections and character. Natural skin texture, real body types. IMPORTANT: Absolutely NO text, NO writing, NO letters, NO words anywhere in the image. Pure photographic portrait only.`;

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
    background: character.background,
    appearance_and_manner: character.appearance_and_manner,
    primary_aspect: character.primary_aspect,
    aspects: character.aspects,
    motivations: character.motivations,
    fears: character.fears,
    portraitUrl,
    recruitmentState: "available" as const,
    generationBatch: new Date().toISOString(),
  };
}
