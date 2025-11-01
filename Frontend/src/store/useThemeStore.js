import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme:  localStorage.getItem("ConnectHub-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("ConnectHub-theme", theme);
    set({ theme });
  },
}));