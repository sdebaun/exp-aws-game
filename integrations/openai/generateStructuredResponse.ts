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
  // format: Parameters<typeof client.responses.create>[0]["text"]["format"];
  instructions: string;
  input: Parameters<typeof client.responses.create>[0]["input"];
}) {
  const model = TEXT_MODEL;
  const response = await client.responses.parse<any, T>({
    model,
    instructions,
    input,
    text: {
      format,
    },
    tools: [
      {
        type: "file_search",
        vector_store_ids: ["vs_68cf2e6262548191a0ac8991b3868688"],
      },
    ],
  });

  // Log costs
  const costs = extractOpenAICosts(response, model)
  console.log(costs)

  if (!response.output_parsed) {
    throw new Error("Failed to generate character");
  }

  return { output_parsed: response.output_parsed, costs };
  // return response;
}

function extractOpenAICosts(
  response: ParsedResponse<any>,
  model: AllowedTextModels,
) {
  const inputCost = response.usage
    ? textGenerationCostPerM[model].input * response.usage.input_tokens /
      1000000
    : 0;
  const outputCost = response.usage
    ? textGenerationCostPerM[model].output * response.usage.output_tokens /
      1000000
    : 0;
  const totalCost = inputCost + outputCost;
  return {
    model,
    inputCost,
    outputCost,
    totalCost,
    inputTokens: response.usage?.input_tokens,
    outputTokens: response.usage?.output_tokens,
  };
}
