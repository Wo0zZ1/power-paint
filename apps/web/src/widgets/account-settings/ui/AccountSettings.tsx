"use client";

import { useTranslations } from "next-intl";

import { Label } from "@/shared/ui";

import { useGetOwnProfileQuery } from "@/entities/user";

import { EditProfileForm } from "@/features/edit-profile";
import { LanguageSelect } from "@/features/switch-language";
import { ThemeSwitcher } from "@/features/switch-theme";

import { SettingsSection } from "./SettingsSection";

export function AccountSettings() {
  const t = useTranslations("settings");
  const { data: profile } = useGetOwnProfileQuery();

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-12">
      <SettingsSection
        title={t("profile.title")}
        description={t("profile.description")}
      >
        <EditProfileForm profile={profile} />
      </SettingsSection>

      <SettingsSection
        title={t("appearance.title")}
        description={t("appearance.description")}
      >
        <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:items-center">
          <span className="text-sm font-medium">{t("theme")}</span>
          <ThemeSwitcher className="w-min" />

          <Label htmlFor="settings-language">{t("language")}</Label>
          <LanguageSelect id="settings-language" userId={profile.id} />
        </div>
      </SettingsSection>
    </div>
  );
}
