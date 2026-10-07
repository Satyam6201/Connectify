import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatWithAI, checkGrammar, translateText } from "../lib/api";
import { FiCheck, FiCopy, FiGlobe, FiImage, FiLoader, FiSend, FiX } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const AIAssistantDrawer = ({ isOpen, onClose, authUser, onApplyText }) => {
  const [activeTab, setActiveTab] = useState("ask"); // "ask" | "grammar" | "translate"
  const [inputAsk, setInputAsk] = useState("");
  const [askResult, setAskResult] = useState(null);

  const [inputGrammar, setInputGrammar] = useState("");
  const [grammarResult, setGrammarResult] = useState(null);

  const [inputTranslate, setInputTranslate] = useState("");
  const [targetLang, setTargetLang] = useState(authUser?.learningLanguage || "Spanish");
  const [translationResult, setTranslationResult] = useState("");

  const { mutate: runAskAI, isPending: isAsking } = useMutation({
    mutationFn: () => chatWithAI({ message: inputAsk }),
    onSuccess: (data) => {
      setAskResult(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "AI response failed");
    },
  });

  const { mutate: runGrammarCheck, isPending: isCheckingGrammar } = useMutation({
    mutationFn: () => checkGrammar(inputGrammar, authUser?.learningLanguage),
    onSuccess: (data) => {
      setGrammarResult(data);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Grammar check failed");
    },
  });

  const { mutate: runTranslation, isPending: isTranslating } = useMutation({
    mutationFn: () => translateText(inputTranslate, targetLang),
    onSuccess: (data) => {
      setTranslationResult(data.translatedText);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Translation failed");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-base-200/95 backdrop-blur-2xl border-l border-base-300 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <IoSparklesOutline className="size-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Meta AI Assistant & Art</h3>
            <p className="text-[10px] opacity-60">Instant Q&A, image creator, grammar & translation</p>
          </div>
        </div>

        <button onClick={onClose} className="btn btn-ghost btn-circle btn-xs">
          <FiX className="size-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-3 border-b border-base-300">
        <div className="grid grid-cols-3 gap-1 bg-base-300 p-1 rounded-xl text-[11px]">
          <button
            onClick={() => setActiveTab("ask")}
            className={`btn btn-xs rounded-lg ${
              activeTab === "ask" ? "btn-primary shadow-sm" : "btn-ghost"
            }`}
          >
            <IoSparklesOutline className="size-3" />
            Meta AI
          </button>

          <button
            onClick={() => setActiveTab("grammar")}
            className={`btn btn-xs rounded-lg ${
              activeTab === "grammar" ? "btn-primary shadow-sm" : "btn-ghost"
            }`}
          >
            Grammar
          </button>

          <button
            onClick={() => setActiveTab("translate")}
            className={`btn btn-xs rounded-lg ${
              activeTab === "translate" ? "btn-primary shadow-sm" : "btn-ghost"
            }`}
          >
            <FiGlobe className="size-3" />
            Translate
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "ask" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold block mb-1">
                Ask Meta AI or Generate Image:
              </label>
              <textarea
                value={inputAsk}
                onChange={(e) => setInputAsk(e.target.value)}
                placeholder="Ask any question, or type /imagine <description> to create an image..."
                className="textarea textarea-bordered w-full h-24 text-xs rounded-xl resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!inputAsk.startsWith("/imagine ")) {
                    setInputAsk(`/imagine ${inputAsk}`);
                  }
                }}
                className="btn btn-ghost btn-xs text-primary rounded-lg"
              >
                <FiImage className="size-3" />
                Add /imagine
              </button>

              <button
                onClick={() => runAskAI()}
                disabled={isAsking || !inputAsk.trim()}
                className="btn btn-primary btn-sm flex-1 rounded-xl gap-1.5 text-xs font-semibold"
              >
                {isAsking ? (
                  <>
                    <FiLoader className="size-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <IoSparklesOutline className="size-3.5" />
                    Ask AI
                  </>
                )}
              </button>
            </div>

            {askResult && (
              <div className="bg-base-100 p-3.5 rounded-xl border border-base-300 space-y-2.5 text-xs">
                {askResult.isImage && askResult.imageUrl ? (
                  <div className="space-y-2">
                    <span className="font-bold block">Generated Image:</span>
                    <img
                      src={askResult.imageUrl}
                      alt={askResult.imagePrompt || "AI art"}
                      className="w-full rounded-lg object-cover max-h-48"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(askResult.imagePrompt || "art")}`;
                      }}
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={askResult.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-xs rounded-lg flex-1"
                      >
                        View Fullscreen
                      </a>
                      {onApplyText && (
                        <button
                          onClick={() => {
                            onApplyText(askResult.imageUrl);
                            toast.success("Inserted image link!");
                          }}
                          className="btn btn-outline btn-xs rounded-lg gap-1"
                        >
                          <FiSend className="size-3" />
                          Insert Link
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="font-bold block">Meta AI Response:</span>
                    <p className="whitespace-pre-wrap leading-relaxed text-base-content/90">
                      {askResult.reply}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(askResult.reply);
                          toast.success("Copied to clipboard!");
                        }}
                        className="btn btn-ghost btn-xs rounded-lg gap-1"
                      >
                        <FiCopy className="size-3" />
                        Copy
                      </button>

                      {onApplyText && (
                        <button
                          onClick={() => {
                            onApplyText(askResult.reply);
                            toast.success("Inserted text!");
                          }}
                          className="btn btn-outline btn-xs rounded-lg gap-1"
                        >
                          <FiSend className="size-3" />
                          Insert
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "grammar" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold block mb-1">
                Sentence in {authUser?.learningLanguage || "Target Language"}:
              </label>
              <textarea
                value={inputGrammar}
                onChange={(e) => setInputGrammar(e.target.value)}
                placeholder="Type your sentence to verify grammar before sending..."
                className="textarea textarea-bordered w-full h-24 text-xs rounded-xl resize-none"
              />
            </div>

            <button
              onClick={() => runGrammarCheck()}
              disabled={isCheckingGrammar || !inputGrammar.trim()}
              className="btn btn-primary btn-sm w-full rounded-xl gap-1.5 text-xs"
            >
              {isCheckingGrammar ? (
                <>
                  <FiLoader className="size-3.5 animate-spin" />
                  Analyzing with Gemini...
                </>
              ) : (
                <>
                  <IoSparklesOutline className="size-3.5" />
                  Check Grammar & Tone
                </>
              )}
            </button>

            {grammarResult && (
              <div className="bg-base-100 p-3.5 rounded-xl border border-base-300 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Result:</span>
                  <span
                    className={`badge badge-xs ${
                      grammarResult.isCorrect ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {grammarResult.isCorrect ? "Grammatically Correct" : "Correction Suggested"}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] opacity-60 block">Corrected Sentence:</span>
                  <p className="font-semibold text-primary mt-0.5">{grammarResult.correctedText}</p>
                </div>

                {grammarResult.explanation && (
                  <div>
                    <span className="text-[11px] opacity-60 block">Explanation:</span>
                    <p className="text-base-content/80 mt-0.5">{grammarResult.explanation}</p>
                  </div>
                )}

                {grammarResult.suggestedAlternative && (
                  <div>
                    <span className="text-[11px] opacity-60 block">Natural Alternative:</span>
                    <p className="text-base-content/70 italic mt-0.5">
                      "{grammarResult.suggestedAlternative}"
                    </p>
                  </div>
                )}

                {onApplyText && (
                  <button
                    onClick={() => {
                      onApplyText(grammarResult.correctedText);
                      toast.success("Applied corrected text!");
                    }}
                    className="btn btn-outline btn-xs w-full rounded-lg gap-1.5 mt-2"
                  >
                    <FiCheck className="size-3" />
                    Use Corrected Text
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "translate" && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold">Translate Text:</label>
                <div className="flex items-center gap-1 text-[11px]">
                  <span>To:</span>
                  <input
                    type="text"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="input input-bordered input-xs w-24 rounded-lg text-[11px]"
                    placeholder="e.g. Spanish"
                  />
                </div>
              </div>

              <textarea
                value={inputTranslate}
                onChange={(e) => setInputTranslate(e.target.value)}
                placeholder="Type or paste any text to translate..."
                className="textarea textarea-bordered w-full h-24 text-xs rounded-xl resize-none"
              />
            </div>

            <button
              onClick={() => runTranslation()}
              disabled={isTranslating || !inputTranslate.trim()}
              className="btn btn-primary btn-sm w-full rounded-xl gap-1.5 text-xs"
            >
              {isTranslating ? (
                <>
                  <FiLoader className="size-3.5 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <FiGlobe className="size-3.5" />
                  Translate Message
                </>
              )}
            </button>

            {translationResult && (
              <div className="bg-base-100 p-3.5 rounded-xl border border-base-300 space-y-2 text-xs">
                <span className="font-bold block">Translation:</span>
                <p className="font-semibold text-primary">{translationResult}</p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(translationResult);
                      toast.success("Copied to clipboard!");
                    }}
                    className="btn btn-ghost btn-xs rounded-lg gap-1"
                  >
                    <FiCopy className="size-3" />
                    Copy
                  </button>

                  {onApplyText && (
                    <button
                      onClick={() => {
                        onApplyText(translationResult);
                        toast.success("Applied to input!");
                      }}
                      className="btn btn-outline btn-xs rounded-lg gap-1"
                    >
                      <FiSend className="size-3" />
                      Insert
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantDrawer;
