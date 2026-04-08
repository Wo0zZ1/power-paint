import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { BoardsCarouselBlock } from "@/widgets/boards-carousel";
import { WorkspacesCarouselBlock } from "@/widgets/workspaces-carousel";

export const metadata: Metadata = {
  title: {
    template: "%s | Power Paint",
    default: "Dashboard",
  },
  description: "Your dashboard with all your boards and workspaces",
};

export default async function DashboardPage() {
  const t = await getTranslations();

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  let personalWorkspace: WorkspaceWithAccess;

  try {
    personalWorkspace = (
      await queryClient.fetchQuery(
        getWorkspacesQueryOption({
          cookieString: cookieStore.toString(),
          type: "personal",
        }),
      )
    )[0];
  } catch (err) {
    console.error("Dashboard error details:", err);
    throw new Error("Failed to fetch personal workspace");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <WorkspacesCarouselBlock
          title={t("workspace.plural")}
          action={
            <Button size="xs" variant="link" className="text-sm" asChild>
              <Link href={ROUTES.DASHBOARD.WORKSPACES}>{t("view_all")}</Link>
            </Button>
          }
        />

        {personalWorkspace && (
          <BoardsCarouselBlock
            className="mt-12"
            title={t("board.personal")}
            action={
              <Button variant="link" size="xs" className="text-sm" asChild>
                <Link
                  href={ROUTES.DASHBOARD.WORKSPACE(
                    personalWorkspace.workspace.id,
                  )}
                >
                  {t("view_all")}
                </Link>
              </Button>
            }
            workspaceWithAccess={personalWorkspace}
          />
        )}
      </div>
    </HydrationBoundary>
  );
}
