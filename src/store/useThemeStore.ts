/**
 * JivniCare Mobile — Theme Preference Store (Zustand)
 * Manages user theme preference (light, dark, or system default).
 * Persisted in AsyncStorage.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme | null; // null means follow OS prefers-color-scheme
  setTheme: (theme: Theme | null) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: null, // default is OS scheme preference
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme;
        if (current === null) {
          // If no choice was made, check OS preference and toggle to the opposite
          const isSystemDark = Appearance.getColorScheme() === "dark";
          set({ theme: isSystemDark ? "light" : "dark" });
        } else {
          set({ theme: current === "light" ? "dark" : "light" });
        }
      },
    }),
    {
      name: "jivnicare-theme-preference-mobile",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
