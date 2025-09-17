// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

export default function () {
  const web = new sst.aws.Nextjs("GameWeb", {
    path: "domain/game-web",
  });

  return {
    gameWeb: web,
    url: web.url,
  };
}
