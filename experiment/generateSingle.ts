import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSingle(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.9,
    });
    return completion.choices[0]?.message?.content ||
      "No completion received";
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
