"use client";

import { useLayoutEffect } from "react";

import { useLocalStorage } from "@/shared/lib/hooks";

import type { Theme } from "./config";
import { DEFAULT_THEME, THEME_PREFERENCE_STORAGE_KEY } from "./config";
import { getSystemTheme } from "./getSystemTheme";

export const useTheme = () => {
  const [themePreference, setThemePreference] = useLocalStorage<Theme>(
    THEME_PREFERENCE_STORAGE_KEY,
    DEFAULT_THEME,
  );

  useLayoutEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      const resolvedTheme =
        themePreference === "system" ? getSystemTheme() : themePreference;

      if (!root.classList.contains(resolvedTheme)) {
        root.classList.remove("light", "dark");
        root.classList.add(resolvedTheme);
      }
    };

    applyTheme();

    if (themePreference === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themePreference]);

  return {
    themePreference,
    setThemePreference,
  };
};
