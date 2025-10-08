import { CharacterEntity } from "./entity";
import { generateCharacter } from "./generator";

interface BatchGeneratorEvent {
  batchSize?: number;
}

/**
 * Generates a batch of characters and saves them to the database.
 * Can be triggered manually or via EventBridge schedule.
 */
export async function handler(event?: BatchGeneratorEvent) {
  const BATCH_SIZE = event?.batchSize ?? 1;

  console.log(
    `[CharacterBatchGenerator] Starting generation of ${BATCH_SIZE} characters...`,
  );

  // Generate characters in parallel
  const promises = Array(BATCH_SIZE)
    .fill(0)
    .map((_, index) => {
      console.log(
        `[CharacterBatchGenerator] Starting character ${
          index + 1
        }/${BATCH_SIZE}`,
      );
      return generateCharacter();
    });

  const results = await Promise.allSettled(promises);

  // Filter successful generations
  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<any>).value);

  // Log failures
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error(`Failed to generate ${failed.length} characters:`, failed);
  }

  // Save successful characters
  if (successful.length > 0) {
    console.log(
      `[CharacterBatchGenerator] Saving ${successful.length} characters to database...`,
    );

    await Promise.all(
      successful.map((char, index) => {
        console.log(
          `[CharacterBatchGenerator] Saving character ${
            index + 1
          }: ${char.name}`,
        );

        // Clean optional fields from origin (ElectroDB strict validation)
        const cleanOrigin = {
          type: char.origin.type,
          place: char.origin.place,
          era: char.origin.era,
          culture: char.origin.culture,
          crossover: char.origin.crossover,
          ...(char.origin.canon ? { canon: char.origin.canon } : {}),
          ...(char.origin.canon_scale
            ? { canon_scale: char.origin.canon_scale }
            : {}),
        };

        return CharacterEntity.create({
          ...char,
          origin: cleanOrigin,
          playerId: "", // Empty string for available characters
          reservationInkSpent: 0,
          totalInkSpent: 0,
        }).go();
      }),
    );

    console.log(
      `[CharacterBatchGenerator] Successfully generated and saved ${successful.length} characters`,
    );
  } else {
    console.log(
      `[CharacterBatchGenerator] No characters were successfully generated`,
    );
  }

  return {
    requested: BATCH_SIZE,
    successful: successful.length,
    failed: failed.length,
  };
}
