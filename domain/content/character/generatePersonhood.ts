import { generateStructuredResponse } from "integrations/openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import z from "zod";
import { META_INSTRUCTIONS, STYLE_INSTRUCTIONS } from "./instructions";
import { Origin, OriginSchema } from "./generateOrigin";

export const generatePersonhood = async ({origin}: {origin: Origin}) => {
  const { output_parsed: personhood, costs } = await generateStructuredResponse({
    format: zodTextFormat(PersonhoodSchema, 'generated_personhood'),
    instructions: `${META_INSTRUCTIONS}\n\n${STYLE_INSTRUCTIONS}`,
    input: [
      {
        role: 'user',
        content: [
          // { type: 'input_text', text: `Use the following input schema:\n\n${zodTextFormat(OriginSchema, 'generated_origin').schema}`},
          { type: 'input_text', text: `Parse this json object as the origin: ${JSON.stringify({origin}, null, 2)}`},
          { type: 'input_text', text: GENERATE_PERSONHOOD_INPUT({origin})},
        ]
      }
    ]
  });

  return { personhood, costs };
};

/**
 * Origin must be either:
 * - historical: explicit place, era, culture
 * - fictional: explicit CANON name from an expansive, multi-work universe
 *   (standalone works are disallowed) with no crossovers
 * Both share display properties for consistent rendering.
 */
const MIN_CHAR = 300
const MAX_CHAR = 700

export const PersonhoodSchema = z.object({
  name: z.string().min(2).describe(
    "The name they are known as, now that they are a riverwalker."
  ),
  beforeTheRiver: z.string().min(MIN_CHAR).max(MAX_CHAR).describe(
    "Summarize who they were in their world of origin — their original name, their role, beliefs, and circumstances before ever awakening on the River."
  ),
  firstPassage: z.string().min(MIN_CHAR).max(MAX_CHAR).describe(
    "Summarize their life from their first awakening on the river, to the culminating event(s) that unlocked riverwalking for them, and their brief career since."
  ),
  presentation: z.string().min(MIN_CHAR).max(MAX_CHAR).describe(
    "Describe how they present themselves by both their appearance, their personality, and their actions"
  ),

});
export type Personhood = z.infer<typeof PersonhoodSchema>

const GENERATE_PERSONHOOD_INPUT = ({origin}: {origin: Origin}) => `
# Instructions

Generate a **Personhood** entry for a character in *The River of Souls*, based on the provided **Origin** object.

A Personhood describes who this being has become since awakening on the River, framed in three short narrative sections:

## **Before the River**
Summarize who they were in their world of origin: their life, work, beliefs, and the tone or struggle that defined them before ever awakening on the River.  

## **First Passage**

Describe their life from the moment they first awakened on the River to the eventual event (or realization) that unlocked their ability to Riverwalk, and the brief career they’ve led since.  
Refer to concrete details involving encounters with other specific cultures, valleys of varying climates and structure, and impactful components to the unlocking of their riverwalking ability.
Their riverwalk-triggering event should be after a non-trivial existence with some obstacles that they overcame before they broke through.

## **Presentation**

Describe how they present themselves now, through both appearance and demeanor: how they look, move, speak, and act. Capture personality as expressed through behavior, and references to elements of the rest of their story, not summary.  

Each section should read like a concise biographical vignette — specific, human, and rich in sensory or emotional detail — but no longer than a paragraph apiece.

# Important Constraints

* Every property should be between 300 and 500 characters.
* Use every relevant detail from the provided **Origin** object (provenance, place, era, culture, and canon) to ensure historical or canonical accuracy.  
* The **tone** must match the River of Souls world: dry, humane wit in the spirit of **Terry Pratchett**, **Iain M. Banks**, and **Douglas Adams** — where absurdity meets melancholy and the human condition is both tragic and funny.  
* Maintain **internal consistency** with the origin’s time, culture, and worldview.  
  - Historical origins should reflect their era’s logic and morality.  
  - Fictional origins should remain true to their canon’s tone and metaphysics.  
* Be **specific** — mention concrete details of profession, habits, or sensory impressions.  
* The **Presentation** should reveal personality through sensory description and observed behavior, not exposition (“he was brave” → “he never stopped to check if the rope would hold”).  
* Never reference the *River of Souls* as a simulation; characters have no meta-awareness.  
* Avoid crossovers or invention of new canons.  
`
