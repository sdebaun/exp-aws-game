import { AccountEntity, CharacterEntity } from "./entities";

export const db = {
  account: {
    async spendInk(accountId: string, amount: number) {
      // Use DynamoDB conditional update to prevent overdraft
      const result = await AccountEntity.update({ accountId })
        .subtract({ ink: amount })
        .where(({ ink }, { gte }) => gte(ink, amount))
        .go();
        
      if (!result.data) {
        throw new Error("Insufficient Ink");
      }
      
      return result;
    }
  },
  
  character: {
    async create(playerId: string, character: {
      characterId: string;
      name: string;
      description: string;
      aspects: string[];
      portraitUrl?: string;
      recruitmentState: "available" | "recruitable" | "rostered";
    }) {
      return CharacterEntity.create({
        playerId,
        ...character
      }).go();
    }
  }
};