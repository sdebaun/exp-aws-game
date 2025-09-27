import {
  ImageGenerateParamsNonStreaming,
  ImagesResponse,
} from "openai/resources/images";
import { client } from "./client";

type AllowedImageModels = "gpt-image-1" | "dall-e-3";

const IMAGE_MODEL: AllowedImageModels = "dall-e-3";
const IMAGE_QUALITY = "standard";

const imageGenerationCostPerImage = {
  "gpt-image-1": {
    "low": {
      "1024x1024": 0.011,
      "1024x1536": 0.016,
      "1536x1024": 0.016,
    },
    "medium": {
      "1024x1024": 0.042,
      "1024x1536": 0.063,
      "1536x1024": 0.063,
    },
    "high": {
      "1024x1024": 0.167,
      "1024x1536": 0.25,
      "1536x1024": 0.25,
    },
  },
  "dall-e-3": {
    "standard": {
      "1024x1024": 0.04,
      "1024x1536": 0.08,
      "1536x1024": 0.08,
    },
    "hd": {
      "1024x1024": 0.08,
      "1024x1536": 0.12,
      "1536x1024": 0.12,
    },
  },
};

export async function generateImage({
  prompt,
  textContent,
  size = "1024x1024",
  quality = IMAGE_QUALITY,
  style,
  responseFormat,
  background = "auto",
  outputFormat = "png",
  moderation = "auto",
}: {
  prompt: string;
  textContent?: string;
  size?:
    | "1024x1024"
    | "1536x1024"
    | "1024x1536";
  quality?: "standard" | "hd" | "low" | "medium" | "high";
  style?: "vivid" | "natural";
  responseFormat?: "url" | "b64_json";
  background?: "transparent" | "opaque" | "auto";
  outputFormat?: "png" | "jpeg" | "webp";
  moderation?: "low" | "auto";
}): Promise<{ url?: string; b64_json?: string; revisedPrompt?: string }> {
  const model = IMAGE_MODEL;

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
    params.size = size;
    params.quality = quality;
    params.style = style || "vivid";
    params.response_format = responseFormat || "url";
  }

  const response = await client.images.generate(params);

  // Log costs
  logOpenAIImagesCosts(response, model, quality, size);

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

function logOpenAIImagesCosts(
  response: ImagesResponse,
  model: AllowedImageModels,
  quality: "low" | "medium" | "high" | "standard" | "hd",
  size: "1024x1024" | "1024x1536" | "1536x1024",
) {
  const modelCosts = imageGenerationCostPerImage[model] as any;
  const totalCost = modelCosts[quality]?.[size] || 0;
  
  console.log("OpenAI Images API Call Costs", {
    model,
    quality,
    size,
    totalCost,
  });
}
