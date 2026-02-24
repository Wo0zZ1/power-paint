"use client";

import { useTranslations } from "next-intl";

import { DropdownMenuItem } from "@/shared/ui";
import { cn } from "@/utils";


import { ThemeSwitcher } from "./ThemeSwitcher";


interface ThemeSwitcherMenuItemProps {
  className?: string;
}

export function ThemeSwitcherMenuItem(props: ThemeSwitcherMenuItemProps) {
  const t = useTranslations("settings");

  return (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className={cn(
        "hover:bg-transparent focus:bg-transparent cursor-default",
        props.className,
      )}
    >
      <label className="mr-2">{t("theme")}</label>
      <ThemeSwitcher />
    </DropdownMenuItem>
  );
}
