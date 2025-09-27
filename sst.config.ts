/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "river-of-souls",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const secrets = (await import("./domain/secrets/stack"))
      .default();
    
    // Content domain owns the content table
    const { contentTable, characterBatchGenerator, listCharacters, deleteCharacter, purgeAllCharacters } = (await import("./domain/content/stack"))
      .default({ secrets });
    
    // Game-web depends on content domain
    const { url } = (await import("./domain/game-web/stack"))
      .default({ secrets });
    
    // Game-admin for managing content
    const gameAdmin = (await import("./domain/game-admin/stack"))
      .default({ secrets, contentTable, characterBatchGenerator, listCharacters, deleteCharacter, purgeAllCharacters });

    return { 
      url,
      adminUrl: gameAdmin.url 
    };
  },
});
