import { generateAIContent } from "../lib/gemini.js";

function buildImageUrl(prompt, style = "") {
  let enrichedPrompt = prompt.trim();
  if (style && style !== "none" && style !== "general") {
    enrichedPrompt = `${enrichedPrompt}, ${style} style, highly detailed, sharp focus`;
  }
  const seed = Math.floor(Math.random() * 1000000);
  return {
    imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(enrichedPrompt)}?model=flux&seed=${seed}`,
    enrichedPrompt,
  };
}

export async function chatWithAI(req, res) {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const trimmed = message.trim();

    const imagineMatch = trimmed.match(/^[/]?(imagine|generate image of|create image of|draw|paint)\s+(.+)/i);
    if (imagineMatch) {
      const imagePrompt = imagineMatch[2].trim();
      const { imageUrl, enrichedPrompt } = buildImageUrl(imagePrompt);
      return res.status(200).json({
        reply: `Here is your generated image for: "${imagePrompt}"`,
        isImage: true,
        imageUrl,
        imagePrompt,
        enrichedPrompt,
      });
    }

    const systemInstruction = `You are "Connectify AI" (working just like Meta AI in WhatsApp).
- You are a helpful, versatile, smart, and friendly AI assistant.
- You help users with general knowledge, questions, advice, learning languages, writing code, summarizing text, brainstorming, and daily assistance.
- Keep your answers clean, well-formatted, and direct.
- Use markdown formatting with bullet points, bold text, or code snippets when helpful.
- If the user asks you to create or generate an image, advise them they can also type "/imagine <description>" or click the image generation button.`;

    const historyContext = conversationHistory
      .slice(-6)
      .map((item) => `${item.sender === "user" ? "User" : "AI"}: ${item.text || item.reply || ""}`)
      .join("\n");

    const prompt = `${historyContext ? `Chat History:\n${historyContext}\n\n` : ""}User: ${trimmed}\nAI:`;

    const reply = await generateAIContent(prompt, systemInstruction);
    res.status(200).json({ reply, isImage: false });
  } catch (error) {
    console.error("AI chat error:", error.message);
    res.status(500).json({ message: "AI response failed. Please try again." });
  }
}

export async function generateImage(req, res) {
  try {
    const { prompt, style = "cinematic" } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Image prompt is required" });
    }

    const { imageUrl, enrichedPrompt } = buildImageUrl(prompt, style);
    res.status(200).json({
      imageUrl,
      prompt: prompt.trim(),
      enrichedPrompt,
      style,
    });
  } catch (error) {
    console.error("Image generation error:", error.message);
    res.status(500).json({ message: "Image generation failed. Please try again." });
  }
}

export async function translateMessage(req, res) {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text to translate is required" });
    }

    const language = targetLanguage || req.user?.nativeLanguage || "English";

    const prompt = `Translate the following message into ${language}.
Return strictly and only the translated text, without quotes, explanations, or extra commentary.

Original Text:
${text.trim()}`;

    const translatedText = await generateAIContent(prompt);
    res.status(200).json({ translatedText });
  } catch (error) {
    console.error("AI translation error:", error.message);
    res.status(500).json({ message: "Translation failed. Please try again." });
  }
}

export async function checkGrammarAndTone(req, res) {
  try {
    const { text, learningLanguage } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text to check is required" });
    }

    const language = learningLanguage || req.user?.learningLanguage || "English";

    const prompt = `You are an expert language teacher and coach. Analyze the following sentence written in ${language}:
"${text.trim()}"

Provide feedback in valid JSON format only, with no surrounding markdown or backticks:
{
  "isCorrect": boolean,
  "correctedText": string,
  "explanation": string,
  "suggestedAlternative": string
}`;

    const rawResponse = await generateAIContent(prompt);
    let cleaned = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();

    let feedback;
    try {
      feedback = JSON.parse(cleaned);
    } catch {
      feedback = {
        isCorrect: false,
        correctedText: rawResponse,
        explanation: "Grammar analyzed.",
        suggestedAlternative: rawResponse,
      };
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error("AI grammar check error:", error.message);
    res.status(500).json({ message: "Grammar check failed. Please try again." });
  }
}
