import { FiCheck } from "react-icons/fi";
import { IoColorPaletteOutline, IoSparklesOutline } from "react-icons/io5";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle relative overflow-hidden"
      >
        <IoColorPaletteOutline className="size-5 relative z-10" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-4 p-3 shadow-2xl bg-base-200/90 backdrop-blur-2xl rounded-2xl w-72 border border-base-content/10 max-h-[420px] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h2 className="font-bold text-base flex items-center gap-2">
              <IoSparklesOutline className="size-4 text-primary" />
              Themes
            </h2>
            <p className="text-xs opacity-60">Personalize your experience</p>
          </div>

          <div className="badge badge-primary badge-sm font-semibold">{THEMES.length}</div>
        </div>

        <div className="space-y-1.5">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`group relative w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-150 overflow-hidden border ${
                theme === themeOption.name
                  ? "bg-primary/15 border-primary/40 shadow-sm"
                  : "hover:bg-base-100 border-transparent hover:border-base-content/10"
              }`}
              onClick={() => setTheme(themeOption.name)}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  theme === themeOption.name
                    ? "bg-primary text-primary-content"
                    : "bg-base-300"
                }`}
              >
                <IoColorPaletteOutline className="size-3.5" />
              </div>

              <div className="flex flex-col items-start">
                <span className="font-semibold text-xs capitalize">{themeOption.name}</span>
              </div>

              <div className="ml-auto flex items-center gap-1">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2.5 rounded-full ring-1 ring-base-100"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {theme === themeOption.name && (
                <div className="absolute top-1.5 right-1.5 bg-primary text-primary-content rounded-full p-0.5">
                  <FiCheck className="size-2.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;