# RIVER OF SOULS — LANDING PAGE REDESIGN SPEC

## Concept: “The River Scroll”

A vertical journey that feels more like ritual than marketing. Visitors descend through three stages — **DISCOVER**, **GUIDE**, **CREATE** — each demanding more investment. The scroll isn’t a gimmick; it’s a ceremony of curiosity turning into participation.

---

## Goals

- Present the River as both myth **and game** — something beautiful, broken, and alive.
- Introduce roles in order of commitment: watch, influence, create.
- Evoke history, wear, and consequence through texture and tone.
- Keep it emotionally heavy, technically efficient, and humanly clear.

---

## Framework & Behavior

- **Framework:** React + Framer Motion
- **Structure:** Hero → Discover → Guide → Create → Footer
- **Navigation:** Persistent top bar (`DISCOVER | GUIDE | CREATE`) highlights the active section.
- **CTA:** Fixed bottom bar that updates per section using Framer Motion scroll triggers.
- **Scroll Behavior:** Vertical, cinematic pacing; subtle parallax and opacity fades.
- **Performance Target:** **Hard cap at 2.5MB.** Optimize visuals to fit the budget.

---

## Experience Flow

### DISCOVER — See the River

**Theme:** Observation and awe. The player arrives at the edge of something vast.
**Visuals:** A slow pan across a wide, dark river fading into mist. Sparse movement, heavy atmosphere.
**Tone:** Grounded wonder, no incense.

> “Every story starts as a ripple. Watch how far it goes.”
> **CTA:** `Read the Sagas →` (/discover)

---

### GUIDE — Bend the Current

**Theme:** Influence and consequence. The visitor becomes complicit.
**Visuals:** The river narrows; glowing threads twist together and apart. Subtle motion implies choice and causality.
**Tone:** Quiet confidence, pragmatic power.

> “Your vote changes the tide. Choose what the River remembers.”
> **CTA:** `Guide the Stories →` (/guide)

---

### CREATE — Start Your Story

**Theme:** Commitment and authorship. The visitor steps fully into the current.
**Visuals:** Light through deep water, fragments of story drifting past. End on a horizon of dim firelight and mist.
**Tone:** Purposeful and human.

> “Make your mark. Build something worth remembering.”
> **CTA:** `Start Your Story →` (/create)

---

## Visual & Motion Language

| Stage    | Palette                    | Motion             | Emotional Arc          |
| -------- | -------------------------- | ------------------ | ---------------------- |
| Discover | Ink black → blue-grey      | Slow drift         | Curiosity → Reflection |
| Guide    | Rust red → amber           | Controlled flicker | Agency → Weight        |
| Create   | Burnt gold → dim firelight | Subtle upward flow | Resolve → Legacy       |

### Key Colors

- **#0a0f12** – ink black (base)
- **#27323a** – blue-grey (transition)
- **#9a4d2e** – rust red (energy)
- **#d6a85b** – aged gold (accent)

---

## Typography

### Font Pairing

- **Header:** Cormorant Garamond — classic with grit.
- **Body/UI:** Space Grotesk — clean but imperfect.

### Usage Hierarchy

| Element              | Font                      | Weight   | Style                       | Role                     |
| -------------------- | ------------------------- | -------- | --------------------------- | ------------------------ |
| Product Name         | Cormorant Garamond        | Bold     | Title Case, +10–20 tracking | Monumental identity      |
| Top Nav              | Space Grotesk             | SemiBold | Uppercase                   | Functional clarity       |
| Hero CTA             | Cormorant Garamond        | Bold     | All caps, +20 tracking      | Clear action             |
| Section Headers      | Cormorant Garamond        | SemiBold | Uppercase                   | Chapter markers          |
| Body Copy            | Space Grotesk             | Regular  | Mixed case                  | Readable, conversational |
| Buttons / Small CTAs | Space Grotesk             | Medium   | Uppercase                   | Simple interaction       |
| Quotes / Epigraphs   | Cormorant Garamond Italic | Regular  | Desaturated gold            | Reflective tone          |

---

## Technical Notes

- **Framer Motion:** use `useScroll` + `useTransform` for smooth parallax and CTA updates.
- **CTA transitions:** fade and ripple distortion (0.6–0.8s easeInOut).
- **Avoid:** heavy video or particle effects that break mobile performance.
- **Accessibility:** readable contrast, no auto-play audio, keyboard navigable.

---

## Copy & Tone

- This is a **game**. Say so.
- Write like someone who’s lived a bit: dry humor, a scar or two, no bullshit.
- Clarity first; poetry earned, not sprayed.
- Voice reference: _Pratchett’s bite, Banks’s clarity, Adams’s timing._
- CTAs are invitations, not slogans.

---

## Core Identity

> _Worn hands. Old myths. New code. Scroll as ceremony._
>
> _We’re all just trying to make sense of the chaos._
