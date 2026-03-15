"use client";

import { useEffect, useRef } from "react";

import { getSystemTheme, useTheme } from "@/features/theme-switcher";
import { cn, invertHexColor } from "@/utils";

interface ColorSwatchProps {
  className?: string;
  color: string;
  invertable?: boolean;
}

export function ColorSwatch({
  className,
  color,
  invertable = false,
}: ColorSwatchProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const { themePreference } = useTheme();

  useEffect(() => {
    if (!elRef.current) return;

    const resolvedTheme =
      themePreference === "system" ? getSystemTheme() : themePreference;

    const targetColor =
      invertable && resolvedTheme === "dark" ? invertHexColor(color) : color;

    elRef.current.style.backgroundColor = targetColor;
  }, [themePreference, color, invertable]);

  return <div className={cn("aspect-square", className)} ref={elRef} />;
}
