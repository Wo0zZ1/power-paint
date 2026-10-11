import { UserRound } from "lucide-react";
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
  title: "Profile not found",
  description: "The user you are looking for does not exist.",
};

export default async function NotFoundPage() {
  const t = await getTranslations("user_profile.notFound");

  return (
    <div className="grow grid">
      <Empty className="p-0 -mt-20" size="lg">
        <EmptyHeader>
          <EmptyMedia size="lg" variant="icon">
            <UserRound />
          </EmptyMedia>
          <EmptyTitle size="lg">{t("title")}</EmptyTitle>
          <EmptyDescription size="lg">{t("description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent size="lg">
          <GoBackButton size="lg" variant="secondary" />
        </EmptyContent>
      </Empty>
    </div>
  );
}
