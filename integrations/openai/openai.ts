import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import {
  ResponseFormatTextConfig,
  ResponseFormatTextJSONSchemaConfig,
  ResponseTextConfig,
} from "openai/resources/responses/responses";
import { Resource } from "sst";
import z from "zod";

// Initialize OpenAI client with SST secret
export const client = new OpenAI({ apiKey: Resource.OpenaiApiKey.value });

export async function createStructuredResponse() {
  // Create the schema manually to match what OpenAI expects
  const manualFormat = {
    type: "json_schema" as const,
    name: "explore_demense_result_parser",
    strict: true,
    schema: {
      type: "object",
      properties: {
        demenses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              aspects: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["name", "description", "aspects"],
            additionalProperties: false,
          },
          minItems: 3,
          maxItems: 3,
        },
      },
      required: ["demenses"],
      additionalProperties: false,
    },
  };

  const response = await client.responses.create({
    model: "gpt-4o",
    instructions:
      `You are a stronghold generator for a dark fantasy game. Generate exactly 3 unique demenses (strongholds/bases) with these constraints:
- Dark, gritty tone - these are fortresses in a harsh world
- Each has unique strategic advantages and aspects
- Each demense should have 2-3 aspects that describe its characteristics`,
    input: "Generate 3 unique demenses for a player to choose from",
    text: {
      format: manualFormat,
    },
  });


  return response;
}

export async function generateObject({
  instructions,
  input,
  text,
}: {
  instructions?: string;
  input?: string;
  text: ResponseTextConfig;
}) {
  const response = await client.responses.parse({
    model: "gpt-4o-2024-08-06",
    // instructions,
    input,
    text,
  });
  return response;
}
// Wrapper for OpenAI function calls with proper typing
export async function generateWithFunction<T>({
  messages,
  functionDef,
  model = "gpt-4-turbo",
}: {
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  functionDef: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
  model?: string;
}): Promise<T> {
  const response = await client.chat.completions.create({
    model,
    messages,
    tools: [{
      type: "function",
      function: functionDef,
    }],
    tool_choice: "required",
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.type !== "function") {
    throw new Error("No function call in response");
  }

  return JSON.parse(toolCall.function.arguments) as T;
}

// Helper for image generation
export async function generateImage({
  prompt,
  model = "dall-e-3",
  size = "1024x1024",
}: {
  prompt: string;
  model?: "dall-e-2" | "dall-e-3";
  size?: "1024x1024" | "1792x1024" | "1024x1792";
}): Promise<string> {
  const response = await client.images.generate({
    model,
    prompt,
    n: 1,
    size,
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error("No image URL in response");
  }

  return imageUrl;
}
