#!/usr/bin/env tsx
import OpenAI from "openai";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { z } from "zod";

const CHAT_INPUTS = [
  {
    character: {
      name: "Marcus Valerius Severus",
      nickname: "Marcus",
      aspects: [
        "Crusty Veteran of the Roman Army",
        "A Friend to Small Furry Creatures",
        "A Guilty Survivor of the Massacre at Teutoberg Forest",
      ],
    },
  },
];
async function main() {
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
