"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";

import { DropdownMenuSubTrigger } from "@/shared/ui";

export function LanguageTrigger() {
  const t = useTranslations("settings");

  return (
    <DropdownMenuSubTrigger className="ml-auto">
      <Languages />
      {t("language")}
    </DropdownMenuSubTrigger>
  );
}
