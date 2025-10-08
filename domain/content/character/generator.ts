import {
  generateImage,
  generateStructuredResponse,
} from "../../../integrations/openai";
import { v4 as uuidv4 } from "uuid";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod.mjs";

const CharacterParser = z.object({
  name: z.string(),
  origin: z.string().describe(
    "Cultural or ethnic background - can be real (Yoruba, Bengali, Sámi, etc.) or fictional but specific",
  ),
  description: z.string().describe(
    "A vivid description in MARKDOWN format with paragraphs, **bold** for emphasis, and *italics* for flavor. Use line breaks between paragraphs.",
  ),
  aspects: z.array(z.string()).min(1).max(3).describe(
    "1-3 short phrases describing key traits, skills, or defining characteristics",
  ),
  appearance: z.string().describe(
    "Physical appearance including skin tone, features, and style influenced by their origin",
  ),
});

/**
 * Generates a new character for the available pool.
 * Based on the existing character generation in game-web but adapted for pool characters.
 */
export async function generateCharacter() {
  const characterId = uuidv4();

  const instructions = `
**Prompt Draft v5: River of Souls Character Generator**

Write in the style of **Terry Pratchett**, **Iain M. Banks**, and **Douglas Adams** — dry wit, philosophical absurdity, and painfully accurate observations about the human condition. Tone should balance humor with melancholy: a sense that existence is both ridiculous and sacred.

---

### Task

Generate a **unique character** for the role-playing game *The River of Souls*, set in a world where every being who ever existed — historical, fictional, and otherwise — awakens along an endless river of valleys at the end of time.

This is not a parody or caricature. Treat the character as a *real person*, one who wakes up cold and confused beside a riverbank in a strange world, surrounded by impossible cultures.

---

### Content Requirements

Each character description must include:

**1. Origin**
Specify time period, geography, and cultural or fictional source.

* If historical, name a specific place, time, and culture.
* If fictional, it **must come from a named, published, human-created canon that is expansive enough to sustain internal variation.**

  * Acceptable canons are those with **multiple works, entries, or adaptations**, such as extended book series, television franchises, or large-scale fictional universes.
  * Examples: *Star Trek*, *Discworld*, *The Culture*, *The Witcher*, *Babylon 5*, *Doctor Who*, *The Wandering Inn*, *Dune*, *The Expanse*, *Foundation*, *A Song of Ice and Fire*, *The Stormlight Archive*, *Mass Effect*, *The Legend of Zelda*, *Final Fantasy*, or *Warhammer 40K*.
  * **Single-work or isolated stories (e.g. The Odyssey, Les Misérables, Beowulf, individual myths, or standalone novels)** are **not permitted** under any circumstances.
* **Do not invent new fictional universes or species.** The UniverseAI treats all human fiction as real, but only those with a robust internal ecosystem of stories are stable enough to persist.

*(Examples: 12th-century Mongol scout; Martian linguist from Le Guin’s Hainish Cycle; Aztec priest; French anarchist from 1871 Paris Commune; a goblin accountant from Pratchett’s Ankh-Morpork.)*

**2. Appearance and Manner**
Describe physical traits, clothing, and demeanor consistent with their origin. Include one memorable sensory detail or gesture — something human.

**3. Aspects**
Three double-edged descriptors in the FATE style: strengths that also cause trouble.
*(e.g. “Knows the Right Thing to Do, and Does It Loudly,” or “Too Clever by Three-Quarters.”)*

**4. Motivations**
Three human-scale desires — love, belonging, curiosity, redemption, safety, understanding, etc. These should be *intimate*, not grandiose.

**5. Fears**
Three meaningful fears — things that would shake their sense of self.

---

### Style & Constraints

* Write as if a dryly amused anthropologist were describing them.
* Favor **specificity over archetype**.
* Avoid obvious fantasy tropes unless they arise naturally from the origin canon.
* Make them feel **alive, funny, and tragic** in equal measure.
* NEVER mention the words *simulation* or *River of Souls* directly. The character has no meta-awareness.
* **Fictional origins must remain internally consistent** with their original canon’s tone, logic, and metaphysics.
* **If uncertain, err on the side of reality, not invention.**

---

### Formatting

* Use **Markdown**.
* Bold for key traits or turns of phrase.
* Italics for interior thoughts or small ironies.
* Paragraph spacing for readability.

---

**Example tone cue:**

> He had the eyes of a man who’d seen too much bureaucracy to believe in gods, but still prayed before opening a form.
> The desert wind had bleached his robes and optimism in equal measure.

`;

  const input = "Generate a character according to the instructions";

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
    const portraitPrompt =
      `Realistic portrait photograph of ${character.name}, a person of ${character.origin} origin: ${character.appearance}. Style: candid documentary photography, natural lighting, unposed. This is a REAL PERSON of ${character.origin} heritage - show authentic ethnic features and skin tone. Could be ugly, beautiful, plain, or interesting-looking. Show genuine human diversity, real faces with imperfections and character. Natural skin texture, real body types. IMPORTANT: Absolutely NO text, NO writing, NO letters, NO words anywhere in the image. Pure photographic portrait only.`;

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
