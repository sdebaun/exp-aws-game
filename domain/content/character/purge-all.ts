import { CharacterModel } from "../table";

/**
 * Lambda handler that DESTROYS ALL CHARACTERS. No prisoners. No mercy.
 * This is the nuclear option.
 */
export async function handler() {
  console.log("[PurgeAllCharacters] INITIATING PURGE SEQUENCE...");

  try {
    // First, get all characters
    const characters = await CharacterModel.scan({});
    const totalCount = characters.length;

    console.log(`[PurgeAllCharacters] Found ${totalCount} characters marked for termination`);

    if (totalCount === 0) {
      console.log("[PurgeAllCharacters] No characters to purge. The wasteland is already empty.");
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          purgedCount: 0,
          message: "Nothing to purge"
        })
      };
    }

    // Delete them all in parallel batches (DynamoDB has a 25 item batch limit)
    const batchSize = 25;
    let purgedCount = 0;

    for (let i = 0; i < characters.length; i += batchSize) {
      const batch = characters.slice(i, i + batchSize);

      console.log(`[PurgeAllCharacters] Purging batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(totalCount / batchSize)}...`);

      await Promise.all(
        batch.map(char =>
          CharacterModel.remove({ characterId: char.characterId })
        )
      );

      purgedCount += batch.length;
    }

    console.log(`[PurgeAllCharacters] PURGE COMPLETE. ${purgedCount} characters have been eliminated.`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        purgedCount,
        message: `Successfully purged ${purgedCount} characters`
      })
    };
  } catch (error) {
    console.error("[PurgeAllCharacters] PURGE FAILED:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed to complete the purge"
      })
    };
  }
}