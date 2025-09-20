import { AutoParseableTextFormat } from "openai/lib/parser";
import { ParsedResponse } from "openai/resources/responses/responses";
import { client } from "./client";

type AllowedTextModels = "gpt-5" | "gpt-5-mini" | "gpt-4o";
type TextCost = { input: number; output: number };

const TEXT_MODEL: AllowedTextModels = "gpt-4o";

const textGenerationCostPerM: Record<AllowedTextModels, TextCost> = {
  "gpt-5": { input: 1.25, output: 10 },
  "gpt-5-mini": { input: 0.25, output: 2 },
  "gpt-4o": { input: 2.5, output: 10 },
};

// export const client = new OpenAI({ apiKey: Resource.OpenaiApiKey.value });

export async function generateStructuredResponse<T>({
  format,
  instructions,
  input,
}: {
  format: AutoParseableTextFormat<T>;
  instructions: string;
  input: string;
}) {
  const model = TEXT_MODEL;
  const response = await client.responses.parse<any, T>({
    model,
    instructions,
    input,
    text: {
      format,
    },
  });

  // Log costs
  logOpenAIResponsesCosts(response, model);

  return response;
}

function logOpenAIResponsesCosts(
  response: ParsedResponse<any>,
  model: AllowedTextModels,
) {
  const inputCost = textGenerationCostPerM[model].input *
    response.usage.input_tokens /
    1000000;
  const outputCost = textGenerationCostPerM[model].output *
    response.usage.output_tokens /
    1000000;
  const totalCost = inputCost + outputCost;
  console.log("OpenAI Responses API Call Costs", {
    model,
    inputCost,
    outputCost,
    totalCost,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  });
}
