import { CharacterEntity } from "./entity";
import { generateCharacter } from "./generator";

/**
 * Generates a batch of characters and saves them to the database.
 * Can be triggered manually or via EventBridge schedule.
 */
export async function handler() {
  const BATCH_SIZE = 5;
  
  console.log(`Generating ${BATCH_SIZE} characters...`);

  // Generate characters in parallel
  const promises = Array(BATCH_SIZE)
    .fill(0)
    .map(() => generateCharacter());
  
  const results = await Promise.allSettled(promises);
  
  // Filter successful generations
  const successful = results
    .filter(r => r.status === "fulfilled")
    .map(r => (r as PromiseFulfilledResult<any>).value);
  
  // Log failures
  const failed = results.filter(r => r.status === "rejected");
  if (failed.length > 0) {
    console.error(`Failed to generate ${failed.length} characters:`, failed);
  }

  // Save successful characters
  if (successful.length > 0) {
    await Promise.all(
      successful.map(char => 
        CharacterEntity.create({
          ...char,
          playerId: undefined, // Available characters have no player
          reservationInkSpent: 0,
          totalInkSpent: 0,
        }).go()
      )
    );
    
    console.log(`Successfully generated and saved ${successful.length} characters`);
  }
  
  return {
    requested: BATCH_SIZE,
    successful: successful.length,
    failed: failed.length,
  };
}