// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

import { Secrets } from "../secrets/stack";

export default function GameAdminStack({ 
  secrets,
  contentTable,
  characterBatchGenerator,
  listCharacters,
  deleteCharacter,
  purgeAllCharacters
}: { 
  secrets: Secrets;
  contentTable: sst.aws.Dynamo;
  characterBatchGenerator: sst.aws.Function;
  listCharacters: sst.aws.Function;
  deleteCharacter: sst.aws.Function;
  purgeAllCharacters: sst.aws.Function;
}) {
  const admin = new sst.aws.Nextjs("GameAdmin", {
    path: "domain/game-admin",
    link: [
      ...Object.values(secrets.auth0), 
      ...Object.values(secrets.openai), 
      contentTable,
      characterBatchGenerator,
      listCharacters,
      deleteCharacter,
      purgeAllCharacters
    ],
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
    gameAdmin: admin,
    url: admin.url,
  };
}