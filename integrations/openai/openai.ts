import OpenAI from "openai";
import {
  ResponseFormatTextConfig,
  ResponseTextConfig,
} from "openai/resources/responses/responses";
import { ImageGenerateParamsNonStreaming } from "openai/resources/images";
import { Resource } from "sst";

// Initialize OpenAI client with SST secret
export const client = new OpenAI({ apiKey: Resource.OpenaiApiKey.value });

export async function createStructuredResponse({
  format,
  instructions,
  input,
}: {
  format: ResponseFormatTextConfig;
  instructions: string;
  input: string;
}) {
  // Create the schema manually to match what OpenAI expects
  // const manualFormat: ResponseFormatTextConfig = {
  //   type: "json_schema" as const,
  //   name: "explore_demense_result_parser",
  //   strict: true,
  //   schema: {
  //     type: "object",
  //     properties: {
  //       demenses: {
  //         type: "array",
  //         items: {
  //           type: "object",
  //           properties: {
  //             name: { type: "string" },
  //             description: { type: "string" },
  //             aspects: {
  //               type: "array",
  //               items: { type: "string" },
  //             },
  //           },
  //           required: ["name", "description", "aspects"],
  //           additionalProperties: false,
  //         },
  //         minItems: 3,
  //         maxItems: 3,
  //       },
  //     },
  //     required: ["demenses"],
  //     additionalProperties: false,
  //   },
  // };

  const response = await client.responses.create({
    model: "gpt-4o",
    //     instructions:
    //       `You are a stronghold generator for a dark fantasy game. Generate exactly 3 unique demenses (strongholds/bases) with these constraints:
    // - Dark, gritty tone - these are fortresses in a harsh world
    // - Each has unique strategic advantages and aspects
    // - Each demense should have 2-3 aspects that describe its characteristics`,
    instructions,
    input,
    text: {
      // format: manualFormat,
      format,
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

// Helper for image generation with support for latest API features
export async function generateImage({
  prompt,
  textContent,
  model = "gpt-image-1",
  size = "auto",
  quality = "auto",
  style,
  responseFormat,
  background = "auto",
  outputFormat = "png",
  moderation = "auto",
}: {
  prompt: string;
  textContent?: string;
  model?: "dall-e-2" | "dall-e-3" | "gpt-image-1";
  size?:
    | "auto"
    | "1024x1024"
    | "1536x1024"
    | "1024x1536"
    | "256x256"
    | "512x512"
    | "1792x1024"
    | "1024x1792";
  quality?: "standard" | "hd" | "low" | "medium" | "high" | "auto";
  style?: "vivid" | "natural";
  responseFormat?: "url" | "b64_json";
  background?: "transparent" | "opaque" | "auto";
  outputFormat?: "png" | "jpeg" | "webp";
  moderation?: "low" | "auto";
}): Promise<{ url?: string; b64_json?: string; revisedPrompt?: string }> {
  // If text content is provided, incorporate it into the prompt
  const finalPrompt = textContent
    ? `${prompt}\n\nBased on the following content:\n${textContent}`
    : prompt;

  // Build params based on model capabilities
  const params: ImageGenerateParamsNonStreaming = {
    prompt: finalPrompt,
    model,
    n: 1,
  };

  // Model-specific parameters
  if (model === "gpt-image-1") {
    params.size = size;
    params.quality = quality;
    params.background = background;
    params.output_format = outputFormat;
    params.moderation = moderation;
    // gpt-image-1 always returns b64_json
  } else if (model === "dall-e-3") {
    params.size = size === "auto" ? "1024x1024" : size;
    params.quality = quality === "auto" ? "standard" : quality;
    params.style = style || "vivid";
    params.response_format = responseFormat || "url";
  } else if (model === "dall-e-2") {
    params.size = size === "auto" ? "1024x1024" : size;
    params.response_format = responseFormat || "url";
  }

  const response = await client.images.generate(params);

  const image = response.data?.[0];
  if (!image) {
    throw new Error("No image in response");
  }

  return {
    url: image.url,
    b64_json: image.b64_json,
    revisedPrompt: image.revised_prompt,
  };
}
