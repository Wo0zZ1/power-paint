"use client";

import { useLocale } from "next-intl";

import type { SupportedLocaleCode } from "@/shared/i18n";
import { ALL_LOCALES } from "@/shared/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import { useUpdateProfileMutation } from "@/entities/user";

import { changeLocaleAction } from "../models/changeLocaleAction";

interface LanguageSelectProps {
  userId: string;
  id?: string;
}

export function LanguageSelect({ userId, id }: LanguageSelectProps) {
  const locale = useLocale();
  const { mutate: updateProfile } = useUpdateProfileMutation();

  // Куки переключает интерфейс, а язык в профиле - письма от auth.
  const handleChangeLanguage = async (value: SupportedLocaleCode) => {
    updateProfile({ userId, data: { locale: value } });
    await changeLocaleAction(value);
  };

  return (
    <Select value={locale} onValueChange={handleChangeLanguage}>
      <SelectTrigger id={id} className="h-12! w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {ALL_LOCALES.map((loc) => (
          <SelectItem
            className="h-8"
            disabled={!loc.enabled}
            key={loc.code}
            value={loc.code}
          >
            {loc.nativeName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
