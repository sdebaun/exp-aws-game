#!/usr/bin/env tsx
import OpenAI from "openai";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { z } from "zod";

// Initialize OpenAI client - expects OPENAI_API_KEY env variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schemas
const PlayerMessageSchema = z.object({
  player: z.string(),
  timestamp: z.string(),
  message: z.string(),
});

const ActionCardSchema = z.object({
  title: z.string(),
  themes: z.array(z.string()),
  power: z.number(),
});

const ActionWithPlayerSchema = z.object({
  player: z.string(),
  action: ActionCardSchema,
});

const ThreatSchema = z.object({
  title: z.string(),
  challengeRating: z.number(),
  expeditionProgress: z.number(),
  personalScores: z.record(z.string(), z.number()),
  progressedBy: z.array(ActionWithPlayerSchema),
  hinderedBy: z.array(ActionWithPlayerSchema),
  solvedBy: z.array(z.string()).optional(),
  worsenedBy: z.array(z.string()).optional(),
});

const ActorSchema = z.object({
  player: z.string(),
  character: z.string(),
  career: z.string(),
});

const PlayerActionSchema = z.object({
  player: z.string(),
  action: ActionCardSchema,
});

const SceneResultSchema = z.object({
  success: z.boolean(),
  individualContributions: z.record(z.string(), z.number()),
  expeditionProgress: z.number(),
  consequences: z.array(z.string()).optional(),
});

const SceneDataSchema = z.object({
  currentScene: z.number(),
  totalScenes: z.number(),
  expeditionName: z.string(),
  shipName: z.string(),
  threats: z.array(ThreatSchema),
  actors: z.array(ActorSchema),
  chat: z.array(PlayerMessageSchema),
  actions: z.array(PlayerActionSchema),
  results: SceneResultSchema,
});

// Type inference from schemas
type PlayerMessage = z.infer<typeof PlayerMessageSchema>;
type ActionCard = z.infer<typeof ActionCardSchema>;
type ActionWithPlayer = z.infer<typeof ActionWithPlayerSchema>;
type Threat = z.infer<typeof ThreatSchema>;
type Actor = z.infer<typeof ActorSchema>;
type PlayerAction = z.infer<typeof PlayerActionSchema>;
type SceneResult = z.infer<typeof SceneResultSchema>;
type SceneData = z.infer<typeof SceneDataSchema>;

async function generateNarrative(
  sceneData: SceneData,
  universeContext?: string,
  instructions?: string,
  style?: string,
): Promise<string> {
  // Create a mapping of player to character for easier reference
  const playerCharacterMap: Record<string, string> = {};
  sceneData.actors.forEach((actor) => {
    playerCharacterMap[actor.player] = actor.character;
  });

  const prompt =
    `You are a narrative generator for an expedition game. Create an engaging narrative for Scene ${sceneData.currentScene} of ${sceneData.totalScenes} in the expedition "${sceneData.expeditionName}" aboard the ship "${sceneData.shipName}".

${instructions ? `# NARRATIVE INSTRUCTIONS:\n${instructions}\n` : ""}

${style ? `# WRITING STYLE:\n${style}\n` : ""}

${universeContext ? `# UNIVERSE CONTEXT:\n${universeContext}\n` : ""}

# THREATS FACED THIS SCENE:
${
      sceneData.threats.map((threat) => {
        const progressedByStr = threat.progressedBy.length > 0 
          ? `\n   Progressed by: ${threat.progressedBy.map(p => `${playerCharacterMap[p.player]} (${p.action.title})`).join(", ")}`
          : "";
        const hinderedByStr = threat.hinderedBy.length > 0
          ? `\n   Hindered by: ${threat.hinderedBy.map(h => `${playerCharacterMap[h.player]} (${h.action.title})`).join(", ")}`
          : "";
        
        return `- ${threat.title} (Challenge Rating: ${threat.challengeRating})
   Expedition Progress: ${threat.expeditionProgress}
   Personal Scores: ${Object.entries(threat.personalScores).map(([player, score]) => `${playerCharacterMap[player]}: ${score}`).join(", ")}${progressedByStr}${hinderedByStr}`;
      }).join("\n\n")
    }

CHARACTERS:
${
      sceneData.actors.map((actor) =>
        `- ${actor.character}, ${actor.career} (played by ${actor.player})`
      ).join("\n")
    }

PLAYER CHAT (OOC):
${
      sceneData.chat.map((msg) =>
        `[${msg.timestamp}] ${msg.player}: ${msg.message}`
      ).join("\n")
    }

ACTIONS TAKEN:
${
      sceneData.actions.map((action) => {
        const character = playerCharacterMap[action.player];
        return `${character} played "${action.action.title}" (${
          action.action.themes.join("/")
        }, Power: ${action.action.power})`;
      }).join("\n")
    }

RESULTS:
- Expedition Success: ${sceneData.results.success ? "YES" : "NO"}
- Individual Contributions: ${
      JSON.stringify(sceneData.results.individualContributions, null, 2)
    }
- Expedition Progress: ${sceneData.results.expeditionProgress}%
${
      sceneData.results.consequences
        ? `- Consequences: ${sceneData.results.consequences.join(", ")}`
        : ""
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a skilled fantasy narrative writer creating stories for an expedition-based game.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    return completion.choices[0]?.message?.content ||
      "Failed to generate narrative";
  } catch (error) {
    console.error("Error generating narrative:", error);
    throw error;
  }
}

// Example usage
async function main() {
  // Read scene data from JSON file
  const scenePath = process.argv[2] || resolve(__dirname, "sample-scene.json");
  const universePath = process.argv[3] || resolve(__dirname, "universe.md");
  const instructionsPath = process.argv[4] ||
    resolve(__dirname, "instructions.md");
  const stylePath = process.argv[5] || resolve(__dirname, "style.md");

  let sceneData: SceneData;
  let universeContext: string | undefined;
  let instructions: string | undefined;
  let style: string | undefined;

  try {
    const sceneContent = readFileSync(scenePath, "utf-8");
    const parsedData = JSON.parse(sceneContent);
    
    // Validate with Zod
    sceneData = SceneDataSchema.parse(parsedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`Invalid scene data structure:`, error.format());
    } else {
      console.error(`Error reading scene data from ${scenePath}:`, error);
    }
    console.error(
      "\nUsage: tsx generate-narrative.ts [scene-data.json] [universe.md] [instructions.md] [style.md]",
    );
    console.error(
      "If no files specified, looks for sample-scene.json, universe.md, instructions.md, and style.md",
    );
    process.exit(1);
  }

  // Try to read universe markdown if available
  try {
    universeContext = readFileSync(universePath, "utf-8");
    console.log("Loaded universe context from", universePath);
  } catch (error) {
    console.log(
      "No universe file found or could not read it - proceeding without world context",
    );
  }

  // Try to read instructions if available
  try {
    instructions = readFileSync(instructionsPath, "utf-8");
    console.log("Loaded narrative instructions from", instructionsPath);
  } catch (error) {
    console.log(
      "No instructions file found or could not read it - proceeding with default instructions",
    );
  }

  // Try to read style guide if available
  try {
    style = readFileSync(stylePath, "utf-8");
    console.log("Loaded writing style from", stylePath);
  } catch (error) {
    console.log(
      "No style file found or could not read it - proceeding without style guide",
    );
  }

  console.log(
    `Generating narrative for Scene ${sceneData.currentScene} of ${sceneData.totalScenes}...`,
  );

  try {
    const narrative = await generateNarrative(
      sceneData,
      universeContext,
      instructions,
      style,
    );

    // Write output to file
    const outputPath = resolve(__dirname, "output.txt");
    const output =
      `Scene ${sceneData.currentScene} of ${sceneData.totalScenes}: ${sceneData.expeditionName}\nShip: ${sceneData.shipName}\n${
        "=".repeat(60)
      }\n\n${narrative}`;

    writeFileSync(outputPath, output, "utf-8");
    console.log(`\nNarrative written to: ${outputPath}`);
  } catch (error) {
    console.error("Failed to generate narrative:", error);
  }
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

export { SceneData, generateNarrative, SceneDataSchema };
