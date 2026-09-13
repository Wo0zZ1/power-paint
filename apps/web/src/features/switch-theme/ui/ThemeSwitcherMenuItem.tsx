"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { DropdownMenuItem } from "@/shared/ui";


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
