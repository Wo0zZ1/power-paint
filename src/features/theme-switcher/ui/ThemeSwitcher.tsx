"use client";

import { cn } from "@/shared/lib/utils";
import { ButtonGroup } from "@/shared/ui";

import { THEMES } from "../model/config";
import { useTheme } from "../model/useTheme";

import { ThemeButton } from "./ThemeButton";

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <ButtonGroup className={cn(props.className)}>
      {Object.values(THEMES).map((themeOption) => (
        <ThemeButton
          key={themeOption}
          theme={themeOption}
          active={theme === themeOption}
          onClick={() => setTheme(themeOption)}
        />
      ))}
    </ButtonGroup>
  );
}
