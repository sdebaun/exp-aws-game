import { CharacterEntity } from "./entity";

/**
 * Lambda handler that returns all characters from the content table.
 * Called by other domains that need character data.
 */
export async function handler() {
  try {
    // Query all characters using ElectroDB
    const result = await CharacterEntity.scan.go();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        characters: result.data,
        count: result.data.length
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