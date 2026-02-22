import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";

import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";

import { Button } from "@/shared/ui";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { CreateWorkspaceButton } from "@/features/create-workspace";

import { WorkspacesCarousel } from "./WorkspacesCarousel";

export async function WorkspacesCarouselBlock() {
  const t = await getTranslations();

  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(
    getWorkspacesQueryOption(cookieStore.toString()),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex items-end mt-8 mb-4">
        <h3 className="mr-auto text-2xl font-semibold">
          {t("workspace.plural")}
        </h3>

        <CreateWorkspaceButton size="sm" className="text-sm mr-4" />
        <Button size="xs" variant="link" className="text-sm" asChild>
          <Link href={ROUTES.DASHBOARD.WORKSPACES("")}>{t("viewAll")}</Link>
        </Button>
      </div>

      <WorkspacesCarousel />
    </HydrationBoundary>
  );
}
