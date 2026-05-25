import { LoaderIcon, Sparkles, MessageCircleMore } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();

  return (
    <div
      data-theme={theme}
      className="min-h-screen overflow-hidden flex items-center justify-center relative bg-base-100"
    >
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
        }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
          className="absolute w-44 h-44 border border-primary/20 rounded-full"
        />

        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          className="absolute w-60 h-60 border border-secondary/20 rounded-full"
        />

        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-28 h-28 bg-primary/10 rounded-full blur-2xl" />

          <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-base-200 shadow-2xl border border-base-300">
            <LoaderIcon className="size-12 text-primary animate-spin" />

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="size-5 text-secondary" />
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
              className="absolute -bottom-2 -left-2"
            >
              <MessageCircleMore className="size-5 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
          }}
          className="mt-10 text-3xl sm:text-4xl font-black tracking-wide"
        >
          Connectify
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{
            delay: 0.6,
          }}
          className="mt-3 text-sm sm:text-base text-center max-w-xs"
        >
          Connecting people through real-time chats and video calls...
        </motion.p>

        <div className="mt-8 flex gap-2">
          {[1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: dot * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PageLoader;