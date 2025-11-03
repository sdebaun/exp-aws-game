import { generateStructuredResponse } from "integrations/openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import z from "zod";
import { META_INSTRUCTIONS, Provenance, STYLE_INSTRUCTIONS } from "./instructions";

export const generateOrigin = async ({provenance}: {provenance: Provenance}) => {
  const { output_parsed: origin, costs } = await generateStructuredResponse({
    format: zodTextFormat(OriginSchema, 'generated_origin'),
    instructions: `${META_INSTRUCTIONS}\n\n${STYLE_INSTRUCTIONS}`,
    input: [
      {
        role: 'user',
        content: [
          { type: 'input_text', text: GENERATE_ORIGIN_INPUT(provenance)},
        ]
      }
    ]
  });

  return { origin, costs };
};

/**
 * Origin must be either:
 * - historical: explicit place, era, culture
 * - fictional: explicit CANON name from an expansive, multi-work universe
 *   (standalone works are disallowed) with no crossovers
 * Both share display properties for consistent rendering.
 */
export const OriginSchema = z.object({
  provenance: z.enum(["historical", "fictional"]),
  place: z
    .string()
    .min(2)
    .max(60)
    .describe(
      "Specific geography, down to the level of specific, inhabited locations within the world.  This should be some combination of city, town, county, region, polity, or planet.  At a specificity appropriate for the origin's provenance and canon."
    ),
  era: z
    .string()
    .min(2)
    .max(60)
    .describe(
      "Specific time period"
    ),
  culture: z
    .string()
    .min(2)
    .max(60)
    .describe(
      "Cultural, ethnic, or canonical identity"
    ),
  canon: z
    .string()
    .optional()
    .nullable()
    .describe(
      "For fictional provenance only: named, published canon from a large multi-work universe.  Choose any sci-fi or fantasy canon from all the works you know of, apart from the river of souls.  For a historical provenance, this is null."
    ),
  canon_scale: z
    .enum(["expansive"])
    .optional()
    .nullable()
    .describe(
      "Fictional canons must be expansive (multi-work). Single-work or standalone stories are not allowed."
    ),
  crossover: z
    .literal("none")
    .describe(
      "Must always be 'none'. Crossovers or blended origins are not permitted."
    ),
}).describe("an origin must be completely consistent both internally and with its provenance and canon, if any.");
export type Origin = z.infer<typeof OriginSchema>

const GENERATE_ORIGIN_INPUT = (provenance: 'historical' | 'fictional') => `
# Instructions

Generate a **unique character origin** for a character with a **${provenance} provenance in the *The River of Souls*.

## **Fictional** provenance:

- Fictional origins must come from a **large, published canon** with many works or adaptations.
- Ensure the canon’s tone and metaphysics are consistent throughout the character.
- Fictional origins must preserve the source canon’s era and technology level; do not blend with other genres unless explicitly part of the canon.

## **historical** provenance:

- Historical origins must come from an actual historical source.  
- Ensure a broad representation across human eras and regions.

# Important Constraints

- Vary your choice of origin in time and space from what you chose last time.
- Do not cluster characters in the same century, continent, or cultural context — draw broadly across human history and major fictional worlds.
- Never create your own canon, culture, or planet names.
- Never include the words “River of Souls” in any field.
- All text fields must be plausible, concise, and specific.
`
