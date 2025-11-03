import { generateStructuredResponse } from "integrations/openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import z from "zod";
import { META_INSTRUCTIONS, STYLE_INSTRUCTIONS } from "./instructions";
import { Origin, OriginSchema } from "./generateOrigin";
import { Personhood, PersonhoodSchema } from "./generatePersonhood";
import { x } from ".sst/platform/src/components";

export const generateTraits = async ({origin, personhood}: {origin: Origin, personhood: Personhood}) => {
  const { output_parsed: traits, costs } = await generateStructuredResponse({
    format: zodTextFormat(TraitsSchema, 'generated_traits'),
    instructions: `${META_INSTRUCTIONS}\n\n${STYLE_INSTRUCTIONS}`,
    input: [
      {
        role: 'user',
        content: [
          // { type: 'input_text', text: `Use the following origin input schema:\n\n${zodTextFormat(OriginSchema, 'generated_origin').schema}`},
          { type: 'input_text', text: `To parse this json object as the origin and personhood: ${JSON.stringify({origin, personhood}, null, 2)}`},
          // { type: 'input_text', text: `Use the following personhood input schema:\n\n${zodTextFormat(PersonhoodSchema, 'generated_personhood').schema}`},
          // { type: 'input_text', text: `To parse this personhood json object: ${{personhood}}`},
          { type: 'input_text', text: GENERATE_TRAITS_INPUT({origin})},
        ]
      }
    ]
  });

  return { traits, costs };
};


const ASPECT_MIN = 90, ASPECT_MAX = 180;

export const Aspect = z.object({
  title: z.string().min(2).describe("The title of the aspect."),
  elaboration: z.string().min(ASPECT_MIN).max(ASPECT_MAX).describe("elaborate on ways this aspect lets the character influence the story, and be influenced by it."),
  magnitude: z.number().min(2).max(5).describe("How impactful this aspect is in the context of the world.")
}).describe("A Double-edged FATE-style aspect (strength that also causes trouble).")

export const Conviction = z.object({
  title: z.string().min(2).describe("The title of the conviction."),
  frontEdge: z.string().min(2).describe("What kind of outcomes fuel the character through this conviction."),
  backEdge: z.string().min(2).describe("What kind of outcomes drain the character through this conviction."),
}).describe("A double-edged sword that describes how the character both fulfills and fails the conviction.")

/**
 * Origin must be either:
 * - historical: explicit place, era, culture
 * - fictional: explicit CANON name from an expansive, multi-work universe
 *   (standalone works are disallowed) with no crossovers
 * Both share display properties for consistent rendering.
 */
export const TraitsSchema = z.object({
  highConcept: z.string().min(2).describe(
    "Like FATE Accelerated, a title that describes the entire character."
  ),
  aspects: z
    .array(Aspect)
    .min(3)
    .max(6)
    .describe(
      "A random number of consistent, coherent, specific and memorable aspects for this character.  avoid generic tropes.",
    ),
  convictions: z
    .array(Conviction)
    .min(3)
    .max(6)
    .describe(
      "A random number of personal hopes and dreams and values and fears that the character has."
    )

});

const GENERATE_TRAITS_INPUT = ({origin}: {origin: Origin}) => `
# Instructions

You are generating a Riverwalker’s traits — the core narrative forces that define how they act and how the world bends around them.
These traits consist of:

* High Concept – their essential identity or story hook.
* Aspects – evocative truths about who they are right now.
* Convictions – the beliefs that shape their decisions and refresh their power -- or drain it.

Each trait must feel personal, culturally grounded, and thematically potent — something that would matter in a story set on the River of Souls.

# What to Include

1. High Concept
A single bold statement summarizing who they are and what they represent.

2. Aspects (Revised Instructions)

Each Aspect describes something the character does or believes that both helps and hurts them.
They are actionable traits, not moods or backstory.

Title:
- Short and concrete — 2–5 words.
- Start with a noun or verb that implies action or consequence.

Elaboration:
- 60–120 characters.
- Must show how it can aid the character and how it can cause trouble.
- Avoid vague poetry or personality adjectives (“mysterious,” “kind,” “haunted”).

Magnitude:
- Indicates how strongly this Aspect shapes their fate.
- Distribute ~12 magnitude points total across all Aspects, with a range of high- and low-magnitude aspects.

Tone:
- Write Aspects as tools for play, not prose.
- If another player can’t use it to justify a risky move or compel a setback, rewrite it.

3. Convictions
Convictions define the emotional feedback loops that sustain or weaken a Riverwalker. They show how specific experiences replenish or drain their will to act on the story.

Title:
- 2–5 words naming a core emotion, tension, or need that shapes their reactions.
- Keep it concrete and evocative, not abstract or moral.

Front Edge:
- Describe the types of outcomes or experiences that fuel and inspire the character through this conviction. 
- Use emotional, sensory language that makes it easy to recognize when this occurs.

Back Edge:
- Describe the outcomes or experiences that drain and mute the character through this conviction.
- Use emotional, sensory language that makes it easy to recognize when this occurs.

Tone and Purpose:
- Write each conviction as an emotional circuit, not a philosophy.
- Avoid statements of belief or intent; instead, show what affects them and how.
- Each conviction must make it clear when a scene has fed or depleted the character.

# Important Constraints

* Keep each line short and strong — like a tattoo, not a paragraph.
* Tie language and imagery to the character’s origin culture when possible.
* Avoid mechanical jargon — every trait should read like a story beat.
* Convictions are not moral; they are what the person believes is true.
* Never list opposites (no “Kind but cruel” cop-outs).
* Maintain tone consistent with the River of Souls: mythic, human, a bit tragic.`
