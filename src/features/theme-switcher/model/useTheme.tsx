import "client-only";

import { useLayoutEffect } from "react";

import { useLocalStorage } from "@/shared/lib/hooks";

import type { Theme } from "./config";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "./config";
import { getSystemTheme } from "./getSystemTheme";

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<Theme>(
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
  );

  // Применение темы к DOM
  useLayoutEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      const targetTheme = theme === "system" ? getSystemTheme() : theme;

      // Оптимизация: применяем только если нужно изменить
      if (!root.classList.contains(targetTheme)) {
        root.classList.remove("light", "dark");
        root.classList.add(targetTheme);
      }
    };

    applyTheme();

    // Отслеживание изменений системной темы
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};
