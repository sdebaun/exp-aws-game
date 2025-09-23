// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../.sst/platform/config.d.ts" />

import { Secrets } from "../secrets/stack";

export default function ContentStack({ secrets }: { secrets: Secrets }) {
  // Character batch generator Lambda
  const characterBatchGenerator = new sst.aws.Function("CharacterBatchGenerator", {
    handler: "domain/content/character/batch-generator.handler",
    link: [...Object.values(secrets.openai)],
    environment: {
      OPENAI_API_KEY: secrets.openai.OPENAI_API_KEY.value,
    },
    timeout: "5 minutes", // Characters can take 30s each
    memory: "1024 MB",
  });

  // EventBridge rule to run batch generator every minute
  const characterGeneratorSchedule = new sst.aws.Cron("CharacterGeneratorSchedule", {
    schedule: "rate(1 minute)",
    job: characterBatchGenerator,
    enabled: false, // Start disabled, enable when ready
  });

  return {
    characterBatchGenerator,
    characterGeneratorSchedule,
  };
}