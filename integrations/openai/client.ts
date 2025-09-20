import OpenAI from "openai";
import { Resource } from "sst";

export const client = new OpenAI({ apiKey: Resource.OpenaiApiKey.value });
