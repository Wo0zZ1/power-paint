import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { auth } from "@/shared/auth";
import { ROUTES } from "@/shared/config";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations();

  const session = await auth();

  if (!session) redirect(ROUTES.SIGNIN);

  return (
    <div className="flex flex-col grow container mx-auto my-8 px-4">
      <Link href={ROUTES.DASHBOARD.ROOT}>
        <h1 className="text-4xl font-bold">{t("dashboard.title")}</h1>
      </Link>

      <p className="font-mono text-md text-muted-foreground mt-2 mb-12">
        {t("dashboard.welcome")}
      </p>
      {children}
    </div>
  );
}
