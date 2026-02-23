import { redirect } from "next/navigation";
import Link from "next/link";

import { getSession } from "@/shared/lib/auth";
import { ROUTES } from "@/shared/config";

import { WorkspacesGridBlock } from "@/widgets/workspaces-grid";
import { getTranslations } from "next-intl/server";

export async function WorkspacesPage() {
  const t = await getTranslations();

  const session = await getSession();

  if (!session) redirect(ROUTES.LOGIN);

  return (
    <WorkspacesGridBlock
      title={t("workspace.plural")}
      link={<Link href={ROUTES.DASHBOARD.ROOT}>{t("goBack")}</Link>}
    />
  );
}
