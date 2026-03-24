"use client";

import { ALL_LOCALES } from "@/shared/i18n";
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/shared/ui";

interface LanguageListProps {
  locale: string;
  onValueChange: (value: string) => void;
}

export function LanguageList({ locale, onValueChange }: LanguageListProps) {
  return (
    <DropdownMenuRadioGroup value={locale} onValueChange={onValueChange}>
      {ALL_LOCALES.map((lang) => (
        <DropdownMenuRadioItem
          key={lang.code}
          value={lang.code}
          disabled={!lang.enabled}
        >
          {lang.nativeName}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );
}
