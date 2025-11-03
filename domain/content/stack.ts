// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

import { Secrets } from "../secrets/stack";

export default function ContentStack({ secrets }: { secrets: Secrets }) {
  // Content table - single table design for all game content
  const contentTable = new sst.aws.Dynamo("ContentTable", {
    fields: {
      pk: "string", // partition key
      sk: "string", // sort key
      gsi1pk: "string", // GSI partition key
      gsi1sk: "string", // GSI sort key
      gsi2pk: "string", // GSI2 partition key for character recruitment
      gsi2sk: "string", // GSI2 sort key for character recruitment
    },
    primaryIndex: { hashKey: "pk", rangeKey: "sk" },
    globalIndexes: {
      gsi1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
      gsi2: { hashKey: "gsi2pk", rangeKey: "gsi2sk" },
    },
    stream: "new-and-old-images",
  });

  // Character generator Lambda - generates one character per invocation
  // Invoke N times in parallel for batch generation (admin UI handles this)
  const characterGenerator = new sst.aws.Function(
    "CharacterGenerator",
    {
      handler: "domain/content/character/generate-one.handler",
      link: [...Object.values(secrets.openai), contentTable],
      environment: {
        OPENAI_API_KEY: secrets.openai.OPENAI_API_KEY.value,
      },
      timeout: "5 minutes", // OpenAI calls can be slow
      memory: "1024 MB",
    },
  );

  // List characters Lambda - returns all characters for admin viewing
  const listCharacters = new sst.aws.Function(
    "ListCharacters",
    {
      handler: "domain/content/character/list-characters.handler",
      link: [contentTable],
      timeout: "30 seconds",
    },
  );

  // Delete character Lambda - deletes a single character
  const deleteCharacter = new sst.aws.Function(
    "DeleteCharacter",
    {
      handler: "domain/content/character/delete-character.handler",
      link: [contentTable],
      timeout: "30 seconds",
    },
  );

  // Purge all characters Lambda - THE NUCLEAR OPTION
  const purgeAllCharacters = new sst.aws.Function(
    "PurgeAllCharacters",
    {
      handler: "domain/content/character/purge-all.handler",
      link: [contentTable],
      timeout: "2 minutes", // Might take a while to nuke everything
    },
  );

  // EventBridge schedule removed - admin UI invokes characterGenerator N times instead

  return {
    contentTable,
    characterGenerator,
    listCharacters,
    deleteCharacter,
    purgeAllCharacters,
  };
}
