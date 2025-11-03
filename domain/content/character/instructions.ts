import z from "zod";

export const META_INSTRUCTIONS = `
You are generating content for the multiplayer web game The River of Souls.
Write with the voice, and the dry, humane wit of **Terry Pratchett**, **Iain M. Banks**, and **Douglas Adams**, where absurdity meets melancholy and the human condition is both tragic and hilarious.
Do not favor any of those author's existing works -- just write with their style, their sense of humor, their outlook on life.
Prefer shorter sentences over longer ones.  Brevity is the soul of wit.
Write in the third person.
`

export const STYLE_INSTRUCTIONS = `
# Writing Style & Constraints

* Write as if a dryly amused anthropologist were observing them.
* Be **specific and grounded**; favor cultural authenticity over archetype or trope.
* Ensure **internal consistency** — all parts of the character (origin, manner, aspects, motivations, and fears) should feel like they emerge naturally from the same person and worldview.
* Reflect the **mindset of their origin**
* Characters should feel **alive, funny, and tragic**.
* Never mention *simulation* or *River of Souls* — they have no meta-awareness.
* Stay consistent with their canon’s tone and logic.
* **No crossovers.** Each belongs wholly to their world.
* When uncertain, **err toward realism**, not invention.
* Use **Markdown** with bold and italics for clarity.
* Do not ever generate a specific, well-known person from any historical or fictional source.
* Do not ever generate a character that is originally from The River of Souls.  A character is always from somewhere else, and they show up in the River of Souls.
`

export const ProvenanceSchema = z.enum(["historical", "fictional"])
export type Provenance = z.infer<typeof ProvenanceSchema>