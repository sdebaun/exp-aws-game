import OpenAI from "openai";
import { ImageGenerateParamsNonStreaming } from "openai/resources/images";
import { AutoParseableTextFormat } from "openai/lib/parser";
import { Resource } from "sst";

export const client = new OpenAI({ apiKey: Resource.OpenaiApiKey.value });

export async function generateStructuredResponse<T>({
  format,
  instructions,
  input,
}: {
  format: AutoParseableTextFormat<T>;
  instructions: string;
  input: string;
}) {
  const response = await client.responses.parse<any, T>({
    model: "gpt-4o",
    instructions,
    input,
    text: {
      format,
    },
  });
  return response;
}

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
