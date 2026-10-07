import { generateAIContent } from "../lib/gemini.js";

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

export async function chatWithAIPartner(req, res) {
  try {
    const { message, conversationHistory = [], topic = "General Conversation" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const learningLanguage = req.user?.learningLanguage || "Spanish";
    const nativeLanguage = req.user?.nativeLanguage || "English";

    const systemInstruction = `You are "Connectify AI Partner", an encouraging, friendly, native speaker of ${learningLanguage} helping a learner whose native language is ${nativeLanguage}.
- Speak predominantly in ${learningLanguage} at a natural, accessible level.
- Keep your reply concise (2-4 sentences max).
- Include 1 engaging follow-up question to keep the conversation flowing.
- If the learner made a noticeable grammar mistake in their input, add a gentle 1-sentence tip at the very end in brackets, e.g. "(Tip: In ${learningLanguage}, say '...' instead of '...')."
- Selected practice topic: ${topic}.`;

    const historyContext = conversationHistory
      .slice(-6)
      .map((item) => `${item.sender === "user" ? "Learner" : "AI Partner"}: ${item.text}`)
      .join("\n");

    const prompt = `${historyContext ? `Conversation history:\n${historyContext}\n\n` : ""}Learner: ${message.trim()}\nAI Partner:`;

    const reply = await generateAIContent(prompt, systemInstruction);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Partner chat error:", error.message);
    res.status(500).json({ message: "AI partner response failed. Please try again." });
  }
}
