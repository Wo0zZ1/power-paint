import { getTranslations } from "next-intl/server";

import { WorkspacesGridBlock } from "@/widgets/workspaces-grid";

export default async function Workspaces() {
  const t = await getTranslations();

  return <WorkspacesGridBlock title={t("workspace.plural")} />;
}
