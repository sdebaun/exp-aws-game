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
    async create(accountId: string, character: {
      characterId: string;
      name: string;
      class: string;
      background: string;
      trait: string;
      portrait?: string;
    }) {
      return CharacterEntity.create({
        accountId,
        ...character
      }).go();
    }
  }
};