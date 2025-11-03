import { CharacterModel } from "../table";
import { UNASSIGNED_PLAYER_ID } from "../schemas";
import { generateCharacter } from "./generator";

/**
 * Lambda handler that generates a single character and saves it to the database.
 *
 * Designed to be invoked N times in parallel from the admin UI or other services.
 * Each invocation is isolated and fails independently.
 */
export async function handler() {
  console.log("[CharacterGenerator] Starting character generation...");

  try {
    const char = await generateCharacter();

    console.log(`[CharacterGenerator] Generated character: ${char.name}`);

    await CharacterModel.create({
      ...char,
      playerId: UNASSIGNED_PLAYER_ID,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(`[CharacterGenerator] Successfully saved character: ${char.characterId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        characterId: char.characterId,
        name: char.name,
      }),
    };
  } catch (error) {
    console.error("[CharacterGenerator] Failed to generate character:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
