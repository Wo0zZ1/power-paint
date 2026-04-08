import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { WorkspacesGridBlock } from "@/widgets/workspaces-grid";

export const metadata: Metadata = {
  title: {
    template: "%s | Power Paint",
    default: "Workspaces",
  },
  description: "Workspaces page",
};

export default async function Workspaces() {
  const t = await getTranslations("workspace");

  return <WorkspacesGridBlock title={t("plural")} />;
}
