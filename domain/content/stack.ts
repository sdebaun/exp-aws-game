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
  });

  // Character batch generator Lambda
  const characterBatchGenerator = new sst.aws.Function(
    "CharacterBatchGenerator",
    {
      handler: "domain/content/character/batch-generator.handler",
      link: [...Object.values(secrets.openai), contentTable],
      environment: {
        OPENAI_API_KEY: secrets.openai.OPENAI_API_KEY.value,
      },
      timeout: "5 minutes", // Characters can take 30s each
      memory: "1024 MB",
    },
  );

  // EventBridge rule to run batch generator every minute
  // const characterGeneratorSchedule = new sst.aws.Cron("CharacterGeneratorSchedule", {
  //   schedule: "rate(1 minute)",
  //   job: characterBatchGenerator.arn,
  //   enabled: false, // Start disabled, enable when ready
  // });

  return {
    contentTable,
    characterBatchGenerator,
    // characterGeneratorSchedule,
  };
}
