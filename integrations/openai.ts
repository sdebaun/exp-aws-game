import OpenAI from "openai";
import { Resource } from "sst";

// Initialize OpenAI client with SST secret
export const openai = new OpenAI({
  apiKey: Resource.openai_OPENAI_API_KEY.value,
});

// Type for the structured function response
export type FunctionCall<T> = {
  name: string;
  arguments: T;
};

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
  const response = await openai.chat.completions.create({
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
  const response = await openai.images.generate({
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