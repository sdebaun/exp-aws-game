import { CharacterEntity } from "./entity";

/**
 * Lambda handler to delete a character from the content table.
 * Called by other domains that need to delete character data.
 */
export async function handler(event: { characterId: string }) {
  console.log("[DeleteCharacter] Deleting character:", event.characterId);
  
  try {
    if (!event.characterId) {
      throw new Error("characterId is required");
    }

    // Delete the character using ElectroDB
    const result = await CharacterEntity.delete({
      characterId: event.characterId
    }).go();
    
    console.log("[DeleteCharacter] Character deleted successfully");
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        deleted: event.characterId
      })
    };
  } catch (error) {
    console.error("[DeleteCharacter] Error deleting character:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: "Failed to delete character" 
      })
    };
  }
}