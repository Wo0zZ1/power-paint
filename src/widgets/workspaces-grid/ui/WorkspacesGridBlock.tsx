import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";

import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { WorkspacesGrid } from "./WorkspacesGrid";

export async function WorkspacesGridBlock() {
  const t = await getTranslations();

  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(
    getWorkspacesQueryOption(cookieStore.toString()),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex justify-between items-end mt-8 mb-4">
        <h3 className="text-2xl font-semibold">{t("workspace.all")}</h3>

        <Button size="xs" variant="link" className="text-sm" asChild>
          <Link href={ROUTES.DASHBOARD.ROOT}>{t("goBack")}</Link>
        </Button>
      </div>

      <WorkspacesGrid />
    </HydrationBoundary>
  );
}
