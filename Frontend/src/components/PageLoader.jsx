import { FiLoader, FiMessageCircle } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();

  return (
    <div
      data-theme={theme}
      className="min-h-screen overflow-hidden flex items-center justify-center relative bg-base-100"
    >
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-base-200 shadow-xl border border-base-300">
          <FiLoader className="size-10 text-primary animate-spin" />
          <IoSparklesOutline className="size-4 text-secondary absolute top-2 right-2" />
          <FiMessageCircle className="size-4 text-primary absolute bottom-2 left-2" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-wide">Connectify</h1>
        <p className="mt-2 text-xs opacity-70 text-center max-w-xs">
          Loading connection and conversations...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;