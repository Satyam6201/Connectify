import { generateAIContent } from "../lib/gemini.js";

const ALLOWED_STYLES = new Set([
  "general",
  "cinematic",
  "anime",
  "cyberpunk",
  "3d-render",
  "oil-painting",
  "photorealistic",
]);

function buildImageUrl(prompt, style = "") {
  let enrichedPrompt = prompt.trim();
  const safeStyle = ALLOWED_STYLES.has(style) ? style : "cinematic";

  if (safeStyle !== "general") {
    enrichedPrompt = `${enrichedPrompt}, ${safeStyle} style, highly detailed, sharp focus`;
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

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required and must be text" });
    }

    const trimmed = message.trim();
    if (trimmed.length > 2000) {
      return res.status(400).json({ message: "Message is too long (maximum 2000 characters)" });
    }

    const safeHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-6) : [];

    const imagineMatch = trimmed.match(/^[/]?(imagine|generate image of|create image of|draw|paint)\s+(.+)/i);
    if (imagineMatch) {
      const imagePrompt = imagineMatch[2].trim().slice(0, 500);
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

    const historyContext = safeHistory
      .map((item) => `${item.sender === "user" ? "User" : "AI"}: ${String(item.text || item.reply || "").slice(0, 500)}`)
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

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ message: "Image prompt is required" });
    }

    const cleanPrompt = prompt.trim();
    if (cleanPrompt.length > 500) {
      return res.status(400).json({ message: "Image prompt is too long (maximum 500 characters)" });
    }

    const safeStyle = typeof style === "string" && ALLOWED_STYLES.has(style) ? style : "cinematic";
    const { imageUrl, enrichedPrompt } = buildImageUrl(cleanPrompt, safeStyle);

    res.status(200).json({
      imageUrl,
      prompt: cleanPrompt,
      enrichedPrompt,
      style: safeStyle,
    });
  } catch (error) {
    console.error("Image generation error:", error.message);
    res.status(500).json({ message: "Image generation failed. Please try again." });
  }
}

export async function translateMessage(req, res) {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Text to translate is required" });
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 2000) {
      return res.status(400).json({ message: "Text is too long for translation (maximum 2000 characters)" });
    }

    const safeLanguage =
      typeof targetLanguage === "string" && targetLanguage.trim()
        ? targetLanguage.trim().slice(0, 50).replace(/[^a-zA-Z\s]/g, "")
        : req.user?.nativeLanguage || "English";

    const prompt = `Translate the following message into ${safeLanguage}.
Return strictly and only the translated text, without quotes, explanations, or extra commentary.

Original Text:
${trimmedText}`;

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

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Text to check is required" });
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 2000) {
      return res.status(400).json({ message: "Text is too long (maximum 2000 characters)" });
    }

    const safeLanguage =
      typeof learningLanguage === "string" && learningLanguage.trim()
        ? learningLanguage.trim().slice(0, 50).replace(/[^a-zA-Z\s]/g, "")
        : req.user?.learningLanguage || "English";

    const prompt = `You are an expert language teacher and coach. Analyze the following sentence written in ${safeLanguage}:
"${trimmedText}"

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
