"use client";

import { EllipsisVertical } from "lucide-react";
import { useTranslations } from "next-intl";


import { LanguageSwitcherMenuItem } from "@/features/language-switcher";
import { ThemeSwitcherMenuItem } from "@/features/theme-switcher";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  Separator,
} from "@/shared/ui";

import { SettingsTooltip } from "./SettingsTooltip";

export function SettingsButton() {
  const settingsTitle = useTranslations("settings")("title");

  return (
    <DropdownMenu>
      <SettingsTooltip content={settingsTitle}>
        <Button className="rounded-full" size="icon-lg" variant="outline">
          <EllipsisVertical />
        </Button>
      </SettingsTooltip>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{settingsTitle}</DropdownMenuLabel>

          <Separator className="my-1" />

          <LanguageSwitcherMenuItem />

          <ThemeSwitcherMenuItem />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
