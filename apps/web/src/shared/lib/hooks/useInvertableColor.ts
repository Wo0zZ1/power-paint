"use client";

import { useEffect, useState } from "react";

import { useTheme, getSystemTheme } from "@/shared/lib/theme";
import { invertColor } from "@/shared/lib/utils";

/**
 * A hook that returns a color inverted based on the user's theme.
 * Initialized with the default color to avoid SSR hydration mismatch,
 * then updates to the inverted color on mount and theme change.
 */
export function useInvertableColor(color: string, invertable: boolean = true) {
  const { themePreference } = useTheme();

  const [activeColor, setActiveColor] = useState(color);
  const [isLoading, setIsloadding] = useState(true);

  useEffect(() => {
    const resolvedTheme =
      themePreference === "system" ? getSystemTheme() : themePreference;

    try {
      const targetColor =
        invertable && resolvedTheme === "dark" ? invertColor(color) : color;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveColor(targetColor);
    } catch (error) {
      console.error(`Failed to invert color [${color}]:`, error);
    }

    setIsloadding(false);
  }, [themePreference, color, invertable]);

  return { activeColor, isLoading };
}
