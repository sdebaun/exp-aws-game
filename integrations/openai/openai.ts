import OpenAI from "openai";
import {
  ResponseFormatTextJSONSchemaConfig,
  ResponseTextConfig,
} from "openai/resources/responses/responses";
import { Resource } from "sst";

// Initialize OpenAI client with SST secret
export const client = new OpenAI({ apiKey: Resource.OpenaiApiKey.value });

// Type for the structured function response
export type FunctionCall<T> = {
  name: string;
  arguments: T;
};

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
    instructions,
    input,
    text,
  });
  console.log("generateObject()", response);
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

  const imageUrl = response.data[0]?.url;
  if (!imageUrl) {
    throw new Error("No image URL in response");
  }

  return imageUrl;
}
