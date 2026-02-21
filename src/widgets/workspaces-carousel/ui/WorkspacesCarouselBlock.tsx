import Link from "next/link";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ROUTES } from "@/shared/config";
import { getQueryClient } from "@/shared/api";

import { Button } from "@/shared/ui";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { WorkspacesCarousel } from "./WorkspacesCarousel";
import { getTranslations } from "next-intl/server";

export async function WorkspacesCarouselBlock() {
  const t = await getTranslations();

  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(
    getWorkspacesQueryOption(cookieStore.toString()),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex justify-between items-end mt-8 mb-4">
        <h3 className="text-2xl font-semibold">{t("workspace.plural")}</h3>

        <Button size="xs" variant="link" className="text-sm" asChild>
          <Link href={ROUTES.DASHBOARD.WORKSPACES("")}>{t("viewAll")}</Link>
        </Button>
      </div>

      <WorkspacesCarousel />
    </HydrationBoundary>
  );
}
