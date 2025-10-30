import { CharacterModel } from "../table";

/**
 * Lambda handler that returns all characters from the content table.
 * Called by other domains that need character data.
 */
export async function handler() {
  try {
    // Scan all characters using OneTable
    const characters = await CharacterModel.scan({});

    return {
      statusCode: 200,
      body: JSON.stringify({
        characters,
        count: characters.length
      })
    };
  } catch (error) {
    console.error("Error fetching characters:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch characters" })
    };
  }
}