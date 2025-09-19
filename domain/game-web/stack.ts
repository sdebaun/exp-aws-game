// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

import { Secrets } from "../secrets/stack";

export default function ({ secrets }: { secrets: Secrets }) {
  // Main game table - single table design
  const gameTable = new sst.aws.Dynamo("GameTable", {
    fields: {
      pk: "string",  // partition key
      sk: "string",  // sort key
      gsi1pk: "string", // GSI partition key
      gsi1sk: "string", // GSI sort key
    },
    primaryIndex: { hashKey: "pk", rangeKey: "sk" },
    globalIndexes: {
      gsi1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
    },
  });

  const web = new sst.aws.Nextjs("GameWeb", {
    path: "domain/game-web",
    link: [...Object.values(secrets.auth0), ...Object.values(secrets.openai), gameTable],
    environment: {
      AUTH0_DOMAIN: secrets.auth0.AUTH0_DOMAIN.value,
      AUTH0_CLIENT_ID: secrets.auth0.AUTH0_CLIENT_ID.value,
      AUTH0_CLIENT_SECRET: secrets.auth0.AUTH0_CLIENT_SECRET.value,
      AUTH0_SECRET: secrets.auth0.AUTH0_SECRET.value,
      APP_BASE_URL: secrets.auth0.APP_BASE_URL.value,
      OPENAI_API_KEY: secrets.openai.OPENAI_API_KEY.value,
    },
  });

  return {
    gameWeb: web,
    gameTable,
    url: web.url,
  };
}
