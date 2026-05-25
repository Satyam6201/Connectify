import { PaletteIcon, SparklesIcon, CheckIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ rotate: 10, scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300 }}
        tabIndex={0}
        className="btn btn-ghost btn-circle relative overflow-hidden"
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
        />

        <PaletteIcon className="size-5 relative z-10" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        tabIndex={0}
        className="dropdown-content mt-4 p-3 shadow-2xl bg-base-200/90 backdrop-blur-2xl
        rounded-3xl w-72 border border-base-content/10 max-h-[420px] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              <SparklesIcon className="size-5 text-primary" />
              Themes
            </h2>
            <p className="text-xs opacity-60">
              Personalize your experience
            </p>
          </div>

          <div className="badge badge-primary badge-sm">
            {THEMES.length}
          </div>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {THEMES.map((themeOption, index) => (
              <motion.button
                key={themeOption.name}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{
                  scale: 1.03,
                  x: 5,
                }}
                whileTap={{ scale: 0.97 }}
                className={`group relative w-full px-4 py-3 rounded-2xl flex items-center gap-3
                transition-all duration-300 overflow-hidden border
                ${
                  theme === themeOption.name
                    ? "bg-primary/15 border-primary/40 shadow-lg shadow-primary/10"
                    : "hover:bg-base-100 border-transparent hover:border-base-content/10"
                }`}
                onClick={() => setTheme(themeOption.name)}
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.4 }}
                  className={`p-2 rounded-xl ${
                    theme === themeOption.name
                      ? "bg-primary text-primary-content"
                      : "bg-base-300"
                  }`}
                >
                  <PaletteIcon className="size-4" />
                </motion.div>

                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">
                    {themeOption.name}
                  </span>

                  <span className="text-xs opacity-60">
                    Modern UI Theme
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-1">
                  {themeOption.colors.map((color, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.4 }}
                      className="size-3 rounded-full ring ring-base-100"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {theme === themeOption.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <div className="bg-primary text-primary-content rounded-full p-1">
                      <CheckIcon className="size-3" />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
                />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeSelector;