#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { z } from "zod";
import { generateSingle } from "../generateSingle";
import { WORLD } from "./WORLD";

const INSTRUCTIONS = `
# Instructions

Generate a character for the role playing game The River of Souls.  Apart from basic identifying information, generate three of each of the following properties:
* A variety of multi-dimensional Aspects, like from the FATE roleplaying game; they can be double-edged swords that describe the characters background and capabilities
* A variety of meaningful human Motivations; things that will satisfy the character internally
* A variety of meaningful human Fears; the things that the character will avoid

Select origins from a broad global pool, including both overrepresented and underrepresented cultures. For fictional sources, use named, specific lore outside of Tolkien/D&D unless randomly selected from at least five alternatives. Always diversify your selections across time, geography, and genre.

IMPORTANT -- ALWAYS FOLLOW THESE RULES:
* This character should NOT be any specific famous historical or fictional character.
* This character should have NO AWARENESS of the label "River of Souls"
* This character should be complex and human -- NOT a two-dimensional parody

Respond with a JSON object that passes the following JSON schema:
{
  title: "Character",
  description: "A character in the river of souls game",
  type: "object",
  properties: {
    id: {
      description: "the uuid of the character",
      type: "string",
    },
    fullName: {
      description: "the full name of the character",
      type: "string"
    },
    shortName: {
      description: "how other characters refer to this character in conversation",
      type: "string"
    },
    appearance: {
      description: "A short paragraph describing the outward appearance of this character",
      type: "string"
    },
    source: {
      description: "the historical culture or specific named fictional lore that the character comes from",
      type: "object",
      properties: {
        sourceMaterial: {
          description: "either 'historical' or some specific named fictional body of work"
          type: "string"
        },
        origin: {
          description: "the historical or fictional time period and culture.  should specify a specific time period and polity.  can be from any culture, part of the world, and time period.",
          type: "string"
        }
      }
    },
    aspects: {
      description: "the FATE aspects for the character",
      type: "array",
      items: {
        type: "string"
        examples: [
          "Crusty Roman Veteran: served in the legion for most of his life",
          "Cunning Vulcan Ambassador: a long history of negotiating with other species and cultures"
        ]
      }
    },
    hopes: {
      description: "the things the character aspires to",
      type: "array",
      items: {
        type: "string"
        examples: [
          "To understand the mysteries of this new world I am in",
          "To establish a safe and honorable community",
          "To experience friendship and companionship",
        ]
      }
    },
    fears: {
      description: "the things the character wants to avoid, and will be distressed by",
      type: "array",
      items: {
        type: "string",
        examples: [
          "I am terrified by senseless loss of life",
          "I fear that my gods have abandoned me",
        ]
      }
    },
  }
}
`;

export async function generateCharacter() {
  return generateSingle(`${WORLD}\n${INSTRUCTIONS}`);
}

async function main() {
  const result = await Promise.all(
    Array.from({ length: 5 }, () => generateCharacter()),
  );
  console.log(result.map((i) => JSON.parse(i)));
}

// Run the script if called directly
if (require.main === module) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    console.error(
      "Usage: OPENAI_API_KEY=your-key-here tsx generate-narrative.ts",
    );
    process.exit(1);
  }

  main().catch(console.error);
}
