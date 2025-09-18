// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

import { Secrets } from "../secrets/stack";

export default function ({ secrets }: { secrets: Secrets }) {
  const web = new sst.aws.Nextjs("GameWeb", {
    path: "domain/game-web",
    link: [...Object.values(secrets.auth0)],
    environment: {
      AUTH0_DOMAIN: secrets.auth0.AUTH0_DOMAIN.value,
      AUTH0_CLIENT_ID: secrets.auth0.AUTH0_CLIENT_ID.value,
      AUTH0_CLIENT_SECRET: secrets.auth0.AUTH0_CLIENT_SECRET.value,
      AUTH0_SECRET: secrets.auth0.AUTH0_SECRET.value,
      APP_BASE_URL: secrets.auth0.APP_BASE_URL.value,
    },
  });

  return {
    gameWeb: web,
    url: web.url,
  };
}
