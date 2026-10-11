import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Theme } from "@/shared/lib/theme";
import { Button } from "@/shared/ui";

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
  const t = useTranslations("settings.themes");

  return (
    <Button
      size="sm"
      variant="outline"
      aria-label={t(props.theme)}
      aria-pressed={props.active}
      disabled={props.active}
      onClick={props.onClick}
    >
      {THEME_ICONS[props.theme]}
    </Button>
  );
}
