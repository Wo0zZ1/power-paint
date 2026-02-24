import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";
import { WorkspacesGridBlock } from "@/widgets/workspaces-grid";


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
