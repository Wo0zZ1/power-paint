import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";
import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";
import { BoardsCarouselBlock } from "@/widgets/boards-carousel";
import { WorkspacesCarouselBlock } from "@/widgets/workspaces-carousel";

export default async function DashboardPage() {
  const t = await getTranslations();

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  try {
    const personalWorkspace = (
      await queryClient.fetchQuery(
        getWorkspacesQueryOption({
          cookieString: cookieStore.toString(),
          type: "personal",
        }),
      )
    )[0];

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
  } catch (err) {
    console.error("Dashboard error details:", err);
    throw new Error("Failed to fetch personal workspace");
  }
}
