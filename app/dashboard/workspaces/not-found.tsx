import { Folder } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui";
import { GoBackButton } from "@/shared/ui/goBackButton";

export const metadata: Metadata = {
  title: {
    template: "%s | Power Paint",
    default: "Workspace not found",
  },
  description: "The workspace you are looking for does not exist.",
};

export default async function NotFoundPage() {
  const t = await getTranslations();

  return (
    <div className="grow grid">
      <Empty className="p-0 -mt-20" size={"lg"}>
        <EmptyHeader>
          <EmptyMedia size="lg" variant="icon">
            <Folder />
          </EmptyMedia>
          <EmptyTitle size="lg">{t("workspace.notFound.title")}</EmptyTitle>
          <EmptyDescription size="lg">
            {t("workspace.notFound.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent size="lg">
          <GoBackButton size="lg" variant="secondary" />
        </EmptyContent>
      </Empty>
    </div>
  );
}
