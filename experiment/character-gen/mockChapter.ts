import { writeFileSync } from "fs";
import { generateSingle } from "../generateSingle";
import { generateCharacter } from "./character-gen";
import { WORLD } from "./WORLD";
import { resolve } from "path";

// * Iain M. Banks

const IMPORTANT = `
# IMPORTANT - Writing Style
Write using a combined style and voice of Terry Pratchett, Hunter S. Thompson, and Douglas Adams.

# IMPORTANT - FOLLOW THESE GUIDELINES:
* Reveal the characters through short bits of dialogue and action
* Do not use long exposition
* Characters will not explicitly reveal things about themselves
* Characters will not overshare
* Throw in color and jargon from the game universe.
`;

const INTRO_INSTRUCTIONS = `
# Instructions

Set the stage in this story by generating a few paragraphs of introduction in this chapter of narrative fiction.
The text should introduce the scene and characters.
Do not have any dialogue in this introduction.
Only describe characters with brief descriptions, actions, and facial expressions.
Do not reveal any of their internal background.

# Background

The characters have lived in the River of Souls for a while, but this is their first time adventuring together.

${IMPORTANT}
`;

const DIALOGUE_INSTRUCTIONS = `
# Instructions

Continue this story with a few, tight paragraphs (between 50-100 words total) that translates a player's chat room message (playerChat) into dialogue as if it were spoken by the specified character to the other characters in this story.
Translate the intent of the player's chat text into language and action that would be used by the character that they are playing.
Keep it short and simple; the story will continue after you generate this dialog.  The scene will continue.

${IMPORTANT}
`;

const MOCK_PLAYER_CHAT = [
  {
    characterIndex: 0,
    playerText: (char: any) => "lol idk what to do in this game",
  },
  {
    characterIndex: 1,
    playerText: (char: any) => "so we should introduce ourselves to each other",
  },
  { characterIndex: 2, playerText: (char: any) => `ok, im ${char.shortName}` },
  {
    characterIndex: 0,
    playerText: (char: any) => "hi, nice to meet you",
  },
  {
    characterIndex: 0,
    playerText: (char: any) => `im ${char.shortName}`,
  },
  {
    characterIndex: 1,
    playerText: (char: any) => "whats important to your character then?",
  },
];

async function main() {
  let story = "";

  console.log("*** GENERATING CHARACTERS");
  const characters = await Promise.all(
    Array.from(
      { length: 3 },
      async () => JSON.parse(await generateCharacter()),
    ),
  );
  const charactersPrompt = `# The Characters In The Scene\n\n${
    JSON.stringify(characters, null, 2)
  }`;
  console.log("*** GENERATING INTRO");
  const introPrompt =
    `${WORLD}\n\n${INTRO_INSTRUCTIONS}\n\n${charactersPrompt}`;
  // console.log(prompt);
  const intro = await generateSingle(introPrompt);
  console.log(intro);
  // console.log(intro);
  story += intro;

  for (let i = 0; i < MOCK_PLAYER_CHAT.length; i++) {
    const playerChat = {
      character: characters[MOCK_PLAYER_CHAT[i].characterIndex],
      playerChat: MOCK_PLAYER_CHAT[i].playerText(
        characters[MOCK_PLAYER_CHAT[i].characterIndex],
      ),
    };
    const dialoguePrompt =
      `${WORLD}\n\n${DIALOGUE_INSTRUCTIONS}\n\n${charactersPrompt}\n\n#The Story So Far\n\n${story}\n# The Next Player Chat\n\n${
        JSON.stringify(playerChat, null, 2)
      }`;
    console.log("*** GENERATING DIALOGUE", playerChat);
    const dialogueResult = await generateSingle(dialoguePrompt);
    console.log(dialogueResult);
    story += `\n\n${dialogueResult}`;
  }

  // Write output to file
  const outputPath = resolve(__dirname, "output.txt");

  writeFileSync(outputPath, story, "utf-8");
  console.log(`\nNarrative written to: ${outputPath}`);
  // console.log(story);
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
