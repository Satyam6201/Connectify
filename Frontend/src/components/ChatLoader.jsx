import { FiLoader } from "react-icons/fi";

function ChatLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative bg-base-100">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative bg-base-200 p-5 rounded-2xl shadow-xl border border-base-300">
          <FiLoader className="size-8 text-primary animate-spin" />
        </div>

        <p className="mt-4 text-center text-sm font-medium tracking-wide opacity-80">
          Connecting to chat...
        </p>
      </div>
    </div>
  );
}

export default ChatLoader;