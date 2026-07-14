/**
 * Hook to resolve active colors based on user's manual theme choice (from useThemeStore)
 * and system color scheme fallback.
 */

import { useColorScheme } from "react-native";
import { useThemeStore } from "../store/useThemeStore";
import { THEME_TOKENS } from "../constants/theme";

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const userPreference = useThemeStore((state) => state.theme);
  const systemTheme = systemScheme === "dark" ? "dark" : "light";
  const activeScheme = (userPreference || systemTheme) as "light" | "dark";
  const colors = THEME_TOKENS[activeScheme];
  const isDark = activeScheme === "dark";

  return { colors, isDark, scheme: activeScheme };
}
