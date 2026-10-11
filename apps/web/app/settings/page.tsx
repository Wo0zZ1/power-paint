import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/shared/config";
import { getKnownSession } from "@/shared/session/server";

import { AccountSettingsBlock } from "@/widgets/account-settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Your profile and appearance settings",
};

export default async function SettingsPage() {
  const [t, session] = await Promise.all([
    getTranslations("settings"),
    getKnownSession(),
  ]);

  if (!session) redirect(ROUTES.SIGNIN);

  return (
    <div className="flex flex-col grow container mx-auto my-8 px-4">
      <h1 className="text-4xl font-bold">{t("title")}</h1>

      <p className="font-mono text-md text-muted-foreground mt-2 mb-12">
        {t("description")}
      </p>

      <AccountSettingsBlock />
    </div>
  );
}
