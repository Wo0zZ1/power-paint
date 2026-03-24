"use client";

import { useLocale } from "next-intl";

import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/shared/ui";

import { changeLocaleAction } from "../models/changeLocaleAction";

import { LanguageList } from "./LanguageList";
import { LanguageTrigger } from "./LanguageTrigger";

export function LanguageSwitcherMenuItem() {
  const locale = useLocale();

  return (
    <DropdownMenuSub>
      <LanguageTrigger />

      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <LanguageList locale={locale} onValueChange={changeLocaleAction} />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
