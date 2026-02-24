import { Sun, Moon, Monitor } from "lucide-react";

import { Button } from "@/shared/ui";

import type { Theme } from "../model/config";

interface ThemeButtonProps {
  className?: string;
  theme: Theme;
  active: boolean;
  onClick: () => void;
}

const THEME_ICONS = {
  light: <Sun />,
  dark: <Moon />,
  system: <Monitor />,
};

export function ThemeButton(props: ThemeButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={props.active}
      onClick={props.onClick}
    >
      {THEME_ICONS[props.theme]}
    </Button>
  );
}
