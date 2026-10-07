import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;

export const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

const PREFERRED_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

export async function generateAIContent(prompt, systemInstruction = "") {
  if (!aiClient) {
    throw new Error("Gemini API key is not configured.");
  }

  let lastError = null;

  for (const model of PREFERRED_MODELS) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate content with Gemini AI.");
}
