/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "exp-aws-game",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const secrets = (await import("./domain/secrets/stack"))
      .default();
    
    // Content domain owns the content table
    const { contentTable } = (await import("./domain/content/stack"))
      .default({ secrets });
    
    // Game-web depends on content domain
    const { url } = (await import("./domain/game-web/stack"))
      .default({ secrets });

    return { url };
  },
});
