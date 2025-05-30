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
    // the all-powerful event bus comes first
    const { bus } = (await import("./domain/integration/stack")).default();

    (await import("./domain/account/stack")).default({ bus });
    (await import("./domain/game/stack")).default({ bus });
  },
});
