import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { checkGrammar, sendAIPartnerMessage, translateText } from "../lib/api";
import {
  FiCheck,
  FiGlobe,
  FiLoader,
  FiSend,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { capitialize } from "../lib/utils";

const PRACTICE_TOPICS = [
  { id: "casual", label: "Casual Everyday Chat" },
  { id: "travel", label: "Travel & Asking Directions" },
  { id: "restaurant", label: "Ordering Food & Dining" },
  { id: "interview", label: "Job Interview & Career" },
  { id: "hobbies", label: "Music, Movies & Hobbies" },
];

const AIPartnerPage = () => {
  const { authUser } = useAuthUser();
  const [selectedTopic, setSelectedTopic] = useState("Casual Everyday Chat");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [translatedMap, setTranslatedMap] = useState({});
  const [grammarFeedback, setGrammarFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef(null);

  const learningLanguage = authUser?.learningLanguage || "Spanish";
  const nativeLanguage = authUser?.nativeLanguage || "English";

  useEffect(() => {
    setMessages([
      {
        id: "init-1",
        sender: "ai",
        text: `Hello ${authUser?.fullName || "friend"}! I am your AI language exchange partner. We are practicing ${capitialize(
          learningLanguage
        )} together. How are you doing today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [authUser, learningLanguage]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, grammarFeedback]);

  const { mutate: sendMessageMutation, isPending: isSending } = useMutation({
    mutationFn: (msgText) =>
      sendAIPartnerMessage({
        message: msgText,
        conversationHistory: messages,
        topic: selectedTopic,
      }),
    onSuccess: (data) => {
      const aiReply = {
        id: Date.now().toString(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "AI Partner is busy. Please try again.");
    },
  });

  const { mutate: handleTranslate, isPending: isTranslating } = useMutation({
    mutationFn: ({ text }) => translateText(text, nativeLanguage),
    onSuccess: (data, variables) => {
      setTranslatedMap((prev) => ({ ...prev, [variables.id]: data.translatedText }));
    },
  });

  const { mutate: handleGrammarCheck, isPending: isCheckingGrammar } = useMutation({
    mutationFn: (text) => checkGrammar(text, learningLanguage),
    onSuccess: (data) => {
      setGrammarFeedback(data);
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    sendMessageMutation(inputText.trim());
    setInputText("");
    setGrammarFeedback(null);
  };

  const handleSpeech = (text) => {
    if (!window.speechSynthesis) {
      toast.error("Text-to-speech not supported in this browser");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-base-100 max-w-5xl mx-auto p-3 sm:p-5">
      <div className="bg-base-200/90 border border-base-300 rounded-2xl p-3.5 mb-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <IoSparklesOutline className="size-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm flex items-center gap-1.5">
              Gemini AI Practice Partner
              <span className="badge badge-primary badge-xs">Always Online</span>
            </h2>
            <p className="text-[11px] opacity-60">
              Practicing {capitialize(learningLanguage)} (Native: {capitialize(nativeLanguage)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70 hidden sm:inline">Scenario:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="select select-bordered select-xs h-8 rounded-lg text-xs"
          >
            {PRACTICE_TOPICS.map((topic) => (
              <option key={topic.id} value={topic.label}>
                {topic.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-base-200/50 border border-base-300 rounded-2xl p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-lg rounded-2xl p-3.5 text-xs sm:text-sm shadow-sm relative group ${
                msg.sender === "user"
                  ? "bg-primary text-primary-content rounded-br-none"
                  : "bg-base-100 border border-base-300 rounded-bl-none"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

              {translatedMap[msg.id] && (
                <div className="mt-2 pt-2 border-t border-base-content/10 text-xs opacity-90 italic">
                  <span className="font-semibold not-italic">Translated: </span>
                  {translatedMap[msg.id]}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-2 pt-1 opacity-75 text-[10px]">
                <span>{msg.timestamp}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSpeech(msg.text)}
                    className="btn btn-ghost btn-circle btn-xs size-5 min-h-0"
                    title="Pronounce Audio"
                  >
                    {isSpeaking ? <FiVolumeX className="size-3" /> : <FiVolume2 className="size-3" />}
                  </button>

                  <button
                    onClick={() => handleTranslate({ id: msg.id, text: msg.text })}
                    disabled={isTranslating}
                    className="btn btn-ghost btn-circle btn-xs size-5 min-h-0"
                    title="Translate"
                  >
                    <FiGlobe className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-2">
            <div className="bg-base-100 border border-base-300 rounded-2xl p-3 shadow-sm flex items-center gap-2 text-xs">
              <FiLoader className="size-3.5 animate-spin text-primary" />
              <span>AI Partner is typing in {capitialize(learningLanguage)}...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {grammarFeedback && (
        <div className="mt-2 bg-base-200 border border-base-300 rounded-xl p-3 text-xs flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-primary mr-1">AI Grammar Coach:</span>
            <span>{grammarFeedback.explanation || grammarFeedback.correctedText}</span>
          </div>
          <button
            onClick={() => setInputText(grammarFeedback.correctedText)}
            className="btn btn-primary btn-xs rounded-lg gap-1 shrink-0"
          >
            <FiCheck className="size-3" />
            Apply Correction
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type message in ${capitialize(learningLanguage)}...`}
          className="input input-bordered flex-1 h-11 rounded-xl text-xs sm:text-sm"
        />

        {inputText.trim() && (
          <button
            type="button"
            onClick={() => handleGrammarCheck(inputText)}
            disabled={isCheckingGrammar}
            className="btn btn-outline btn-primary btn-sm h-11 rounded-xl gap-1 text-xs"
            title="Check Grammar before sending"
          >
            <IoSparklesOutline className="size-3.5" />
            <span className="hidden sm:inline">Coach</span>
          </button>
        )}

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="btn btn-primary btn-sm h-11 px-5 rounded-xl gap-1.5 text-xs font-semibold"
        >
          <FiSend className="size-3.5" />
          Send
        </button>
      </form>
    </div>
  );
};

export default AIPartnerPage;
