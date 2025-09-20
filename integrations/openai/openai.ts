// import OpenAI from "openai";
// import { ImageGenerateParamsNonStreaming } from "openai/resources/images";
// import { AutoParseableTextFormat } from "openai/lib/parser";
// import { Resource } from "sst";
// import { ParsedResponse } from "openai/resources/responses/responses";

// type AllowedTextModels = "gpt-5" | "gpt-5-mini" | "gpt-4o";
// type AllowedImageModels = "gpt-image-1" | "dall-e-3";

// const TEXT_MODEL: AllowedTextModels = "gpt-4o";
// // const IMAGE_MODEL: AllowedImageModels = "gpt-image-1";
// const IMAGE_MODEL: AllowedImageModels = "dall-e-3";
// const IMAGE_QUALITY = "standard";
// type TextCost = { input: number; output: number };

// const textGenerationCostPerM: Record<AllowedTextModels, TextCost> = {
//   "gpt-5": { input: 1.25, output: 10 },
//   "gpt-5-mini": { input: 0.25, output: 2 },
//   "gpt-4o": { input: 2.5, output: 10 },
// };

// const imageGenerationCostPerImage = {
//   "gpt-image-1": {
//     "low": {
//       "1024x1024": 0.011,
//       "1024x1536": 0.016,
//       "1536x1024": 0.016,
//     },
//     "medium": {
//       "1024x1024": 0.042,
//       "1024x1536": 0.063,
//       "1536x1024": 0.063,
//     },
//     "high": {
//       "1024x1024": 0.167,
//       "1024x1536": 0.25,
//       "1536x1024": 0.25,
//     },
//   },
//   "dall-e-3": {
//     "standard": {
//       "1024x1024": 0.04,
//       "1024x1536": 0.08,
//       "1536x1024": 0.08,
//     },
//     "hd": {
//       "1024x1024": 0.08,
//       "1024x1536": 0.12,
//       "1536x1024": 0.12,
//     },
//   },
// };

// export const client = new OpenAI({ apiKey: Resource.OpenaiApiKey.value });

// export async function generateStructuredResponse<T>({
//   format,
//   instructions,
//   input,
// }: {
//   format: AutoParseableTextFormat<T>;
//   instructions: string;
//   input: string;
// }) {
//   const model = TEXT_MODEL;
//   const response = await client.responses.parse<any, T>({
//     model,
//     instructions,
//     input,
//     text: {
//       format,
//     },
//   });

//   // Log costs
//   logOpenAIResponsesCosts(response, model);

//   return response;
// }

// export async function generateImage({
//   prompt,
//   textContent,
//   // model = "gpt-image-1",
//   size = "1024x1024",
//   // quality = "standard",
//   quality = IMAGE_QUALITY,
//   style,
//   responseFormat,
//   background = "auto",
//   outputFormat = "png",
//   moderation = "auto",
// }: {
//   prompt: string;
//   textContent?: string;
//   // model?: "dall-e-2" | "dall-e-3" | "gpt-image-1";
//   size?:
//     | "1024x1024"
//     | "1536x1024"
//     | "1024x1536";
//   quality?: "standard" | "hd" | "low" | "medium" | "high";
//   style?: "vivid" | "natural";
//   responseFormat?: "url" | "b64_json";
//   background?: "transparent" | "opaque" | "auto";
//   outputFormat?: "png" | "jpeg" | "webp";
//   moderation?: "low" | "auto";
// }): Promise<{ url?: string; b64_json?: string; revisedPrompt?: string }> {
//   const model = IMAGE_MODEL;
//   // If text content is provided, incorporate it into the prompt
//   const finalPrompt = textContent
//     ? `${prompt}\n\nBased on the following content:\n${textContent}`
//     : prompt;

//   // Build params based on model capabilities
//   const params: ImageGenerateParamsNonStreaming = {
//     prompt: finalPrompt,
//     model,
//     n: 1,
//   };

//   // Model-specific parameters
//   if (model === "gpt-image-1") {
//     params.size = size;
//     params.quality = quality;
//     params.background = background;
//     params.output_format = outputFormat;
//     params.moderation = moderation;
//     // gpt-image-1 always returns b64_json
//   } else if (model === "dall-e-3") {
//     params.size = size;
//     params.quality = quality;
//     params.style = style || "vivid";
//     params.response_format = responseFormat || "url";
//   } else if (model === "dall-e-2") {
//     params.size = size;
//     params.response_format = responseFormat || "url";
//   }

//   const response = await client.images.generate(params);

//   logOpenAIImagesCosts(response, model, quality, size);

//   const image = response.data?.[0];
//   if (!image) {
//     throw new Error("No image in response");
//   }

//   return {
//     url: image.url,
//     b64_json: image.b64_json,
//     revisedPrompt: image.revised_prompt,
//   };
// }

// function logOpenAIResponsesCosts(
//   response: ParsedResponse<any>,
//   model: AllowedTextModels,
// ) {
//   const inputCost = textGenerationCostPerM[model].input *
//     response.usage.input_tokens /
//     1000000;
//   const outputCost = textGenerationCostPerM[model].output *
//     response.usage.output_tokens /
//     1000000;
//   const totalCost = inputCost + outputCost;
//   console.log("OpenAI Responses API Call Costs", {
//     model,
//     inputCost,
//     outputCost,
//     totalCost,
//     inputTokens: response.usage.input_tokens,
//     outputTokens: response.usage.output_tokens,
//   });
// }

// function logOpenAIImagesCosts(
//   response: OpenAI.Images.ImagesResponse,
//   model: AllowedImageModels,
//   quality: "low" | "medium" | "high" | "standard" | "hd",
//   size: "1024x1024" | "1024x1536" | "1536x1024",
// ) {
//   console.log("OpenAI Responses API Call Costs", {
//     model,
//     quality,
//     size,
//     totalCost: imageGenerationCostPerImage[model][quality][size],
//   });
// }
