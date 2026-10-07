import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { chatWithAI, generateAIImage } from "../lib/api";
import {
  FiCopy,
  FiDownload,
  FiImage,
  FiLoader,
  FiMaximize2,
  FiMessageSquare,
  FiSend,
  FiTrash2,
  FiVolume2,
  FiVolumeX,
  FiX,
} from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import toast from "react-hot-toast";

const SUGGESTED_PROMPTS = [
  { label: "Create Image: Cyberpunk City", prompt: "/imagine a futuristic cyberpunk neon city at midnight with flying cars" },
  { label: "Create Image: Anime Warrior", prompt: "/imagine an anime warrior standing on a mountain peak at sunset, 8k" },
  { label: "Explain: Quantum Physics", prompt: "Explain quantum computing in 2 simple sentences like I am 10 years old." },
  { label: "Code: React Custom Hook", prompt: "Write a clean React custom hook for handling window resize events with debounce." },
  { label: "Language: Spanish Coffee Phrases", prompt: "Give me 5 essential Spanish phrases for ordering coffee in Madrid." },
];

const IMAGE_STYLES = [
  { id: "general", label: "Default" },
  { id: "cinematic", label: "Cinematic" },
  { id: "anime", label: "Anime" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "3d-render", label: "3D Render" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "photorealistic", label: "Photorealistic" },
];

const MetaAIPage = () => {
  const { authUser } = useAuthUser();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isImageMode, setIsImageMode] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("cinematic");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: "meta-init",
        sender: "ai",
        text: `Hello ${authUser?.fullName || "there"}! I'm your AI assistant. You can ask me questions, get coding and language help, or type "/imagine <prompt>" to generate high-resolution AI images instantly.`,
        isImage: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [authUser]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { mutate: sendChatMutation, isPending: isChatLoading } = useMutation({
    mutationFn: (msg) =>
      chatWithAI({
        message: msg,
        conversationHistory: messages,
      }),
    onSuccess: (data) => {
      const newAiMsg = {
        id: Date.now().toString(),
        sender: "ai",
        text: data.reply,
        isImage: data.isImage || false,
        imageUrl: data.imageUrl || null,
        imagePrompt: data.imagePrompt || null,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newAiMsg]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "AI is currently busy. Please try again.");
    },
  });

  const { mutate: sendImageMutation, isPending: isImageLoading } = useMutation({
    mutationFn: ({ prompt, style }) => generateAIImage({ prompt, style }),
    onSuccess: (data) => {
      const newAiMsg = {
        id: Date.now().toString(),
        sender: "ai",
        text: `Generated image for: "${data.prompt}" (${data.style || "standard"})`,
        isImage: true,
        imageUrl: data.imageUrl,
        imagePrompt: data.prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newAiMsg]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to generate image. Please try again.");
    },
  });

  const isLoading = isChatLoading || isImageLoading;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const trimmed = inputText.trim();

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
      isImage: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    if (isImageMode || trimmed.toLowerCase().startsWith("/imagine")) {
      const promptCleaned = trimmed.replace(/^\/imagine\s+/i, "");
      sendImageMutation({ prompt: promptCleaned, style: selectedStyle });
    } else {
      sendChatMutation(trimmed);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDownloadImage = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `connectify-ai-${Date.now()}.jpg`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Download started!");
  };

  const handleSpeech = (text) => {
    if (!window.speechSynthesis) {
      toast.error("Text-to-speech not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "meta-reset",
        sender: "ai",
        text: `Chat cleared! How can I assist you right now?`,
        isImage: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    toast.success("Chat history cleared.");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-base-100 max-w-5xl mx-auto p-3 sm:p-5">
      <div className="bg-base-200/90 border border-base-300 rounded-2xl p-3.5 mb-3 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-md">
              <div className="w-full h-full bg-base-100 rounded-[14px] flex items-center justify-center text-primary">
                <FaRobot className="size-5" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-success rounded-full ring-2 ring-base-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base">Meta AI</h2>
              <span className="badge badge-primary badge-xs">Assistant & Art</span>
            </div>
            <p className="text-[11px] opacity-60">
              Ask anything, write code, or type <code className="text-primary font-mono">/imagine</code> for art
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsImageMode((prev) => !prev)}
            className={`btn btn-xs rounded-lg gap-1.5 ${
              isImageMode ? "btn-primary" : "btn-ghost border border-base-300"
            }`}
          >
            <FiImage className="size-3.5" />
            <span className="hidden sm:inline">{isImageMode ? "Image Mode ON" : "Image Mode"}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="btn btn-ghost btn-circle btn-xs size-7 min-h-0 text-base-content/70 hover:text-error"
            title="Clear Chat"
          >
            <FiTrash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {isImageMode && (
        <div className="mb-2 bg-base-200/80 border border-primary/30 rounded-xl p-2.5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-primary shrink-0 flex items-center gap-1">
            <IoSparklesOutline className="size-3.5" />
            Art Style:
          </span>
          <div className="flex items-center gap-1.5">
            {IMAGE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`btn btn-xs rounded-lg ${
                  selectedStyle === style.id ? "btn-primary" : "btn-ghost bg-base-100/60"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-base-200/50 border border-base-300 rounded-2xl p-3 sm:p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-3.5 text-xs sm:text-sm shadow-sm relative group ${
                msg.sender === "user"
                  ? "bg-primary text-primary-content rounded-br-none"
                  : "bg-base-100 border border-base-300 rounded-bl-none"
              }`}
            >
              {msg.isImage && msg.imageUrl ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold opacity-90">
                    <span className="flex items-center gap-1">
                      <IoSparklesOutline className="size-3.5 text-primary" />
                      AI Generated Artwork
                    </span>
                    <span className="badge badge-outline badge-xs">{selectedStyle}</span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-base-300 group/img aspect-square max-w-md mx-auto">
                    <img
                      src={msg.imageUrl}
                      alt={msg.imagePrompt || "AI generated image"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setFullscreenImage(msg.imageUrl)}
                        className="btn btn-circle btn-sm bg-base-100 text-base-content border-none"
                        title="View Fullscreen"
                      >
                        <FiMaximize2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadImage(msg.imageUrl, msg.imagePrompt)}
                        className="btn btn-circle btn-sm btn-primary border-none"
                        title="Download Image"
                      >
                        <FiDownload className="size-4" />
                      </button>
                    </div>
                  </div>

                  {msg.imagePrompt && (
                    <p className="text-[11px] opacity-80 italic">
                      "{msg.imagePrompt}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</div>
              )}

              <div className="flex items-center justify-between gap-3 mt-2.5 pt-1 opacity-70 text-[10px]">
                <span>{msg.timestamp}</span>

                {msg.sender === "ai" && (
                  <div className="flex items-center gap-1">
                    {!msg.isImage && (
                      <button
                        onClick={() => handleSpeech(msg.text)}
                        className="btn btn-ghost btn-circle btn-xs size-5 min-h-0"
                        title="Read aloud"
                      >
                        {isSpeaking ? <FiVolumeX className="size-3" /> : <FiVolume2 className="size-3" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(msg.text || msg.imagePrompt)}
                      className="btn btn-ghost btn-circle btn-xs size-5 min-h-0"
                      title="Copy to clipboard"
                    >
                      <FiCopy className="size-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-base-100 border border-base-300 rounded-2xl p-3 shadow-sm flex items-center gap-2 text-xs">
              <FiLoader className="size-3.5 animate-spin text-primary" />
              <span>{isImageLoading ? "Generating AI artwork..." : "Meta AI is thinking..."}</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {messages.length <= 2 && (
        <div className="py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          {SUGGESTED_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(item.prompt);
                if (item.prompt.startsWith("/imagine")) {
                  setIsImageMode(true);
                }
              }}
              className="btn btn-xs rounded-full border border-base-300 bg-base-200/80 hover:bg-base-200 shrink-0 text-[11px] font-normal"
            >
              <IoSparklesOutline className="size-3 text-primary" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isImageMode
                ? "Describe the image to create (e.g. cute cat in space)..."
                : "Ask anything or type /imagine <prompt>..."
            }
            className="input input-bordered w-full h-11 pl-3.5 pr-24 rounded-xl text-xs sm:text-sm bg-base-100"
          />

          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (!inputText.startsWith("/imagine ")) {
                  setInputText(`/imagine ${inputText}`);
                }
                setIsImageMode(true);
              }}
              className="btn btn-ghost btn-xs text-[10px] text-primary hover:bg-primary/10 rounded-lg px-2"
              title="Add /imagine command"
            >
              /imagine
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="btn btn-primary btn-sm h-11 px-4 sm:px-5 rounded-xl gap-1.5 text-xs font-semibold shrink-0"
        >
          {isImageMode ? <FiImage className="size-3.5" /> : <FiSend className="size-3.5" />}
          <span className="hidden sm:inline">{isImageMode ? "Generate" : "Send"}</span>
        </button>
      </form>

      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-10 right-0 btn btn-circle btn-sm bg-base-100/30 text-white hover:bg-base-100/50 border-none"
            >
              <FiX className="size-4" />
            </button>
            <img
              src={fullscreenImage}
              alt="Fullscreen AI Art"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => handleDownloadImage(fullscreenImage, "meta-ai-art")}
                className="btn btn-primary btn-sm rounded-xl gap-2 text-xs"
              >
                <FiDownload className="size-3.5" />
                Download Full Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaAIPage;
