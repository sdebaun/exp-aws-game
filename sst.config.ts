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

    // DNS configuration for custom domains
    const dns = (await import("./domain/dns/stack"))
      .default();

    // Content domain owns the content table
    const {
      contentTable,
      characterGenerator,
      listCharacters,
      deleteCharacter,
      purgeAllCharacters,
    } = (await import("./domain/content/stack"))
      .default({ secrets });

    // Game-web depends on content domain and DNS
    const { url, chatApi } = (await import("./domain/game-web/stack"))
      .default({ secrets, dns });

    // Game-admin for managing content
    const gameAdmin = (await import("./domain/game-admin/stack"))
      .default({
        secrets,
        contentTable,
        characterGenerator,
        listCharacters,
        deleteCharacter,
        purgeAllCharacters,
      });

    return {
      url,
      adminUrl: gameAdmin.url,
      chatWsUrl: chatApi.url,
    };
  },
});
