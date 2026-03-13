import { Folder } from "lucide-react";
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

export default async function NotFoundPage() {
  const t = await getTranslations();

  return (
    <div className="grow grid">
      <Empty className="p-0 -mt-20" size={"lg"}>
        <EmptyHeader>
          <EmptyMedia size="lg" variant="icon">
            <Folder />
          </EmptyMedia>
          <EmptyTitle size="lg">{t("board.notFound.title")}</EmptyTitle>
          <EmptyDescription size="lg">
            {t("board.notFound.description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent size="lg">
          <GoBackButton size="lg" variant="secondary" />
        </EmptyContent>
      </Empty>
    </div>
  );
}
