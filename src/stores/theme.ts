import { defineStore } from "pinia";

type ThemeMode = "light" | "dark";

const LIGHT: ThemeMode = "light";
const DARK: ThemeMode = "dark";
const THEME_KEY = "themeMode";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    themeMode: LIGHT as ThemeMode,
  }),

  getters: {
    theme: (state) => state.themeMode,
    isDark: (state) => state.themeMode === DARK,
  },

  actions: {
    initTheme() {
      const savedTheme = localStorage.getItem(THEME_KEY);
      this.themeMode = this.validateTheme(savedTheme);
      this.applyTheme();
    },

    toggleTheme() {
      this.themeMode = this.themeMode === LIGHT ? DARK : LIGHT;
      this.persistTheme();
      this.applyTheme();
    },

    applyTheme() {
      const htmlClass = document.documentElement.classList;
      htmlClass.remove(LIGHT, DARK);
      htmlClass.add(this.themeMode);
    },

    persistTheme() {
      localStorage.setItem(THEME_KEY, this.themeMode);
    },

    validateTheme(theme: string | null): ThemeMode {
      return theme === LIGHT || theme === DARK ? theme : LIGHT;
    },
  },
});
