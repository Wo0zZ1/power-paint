import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";
import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";
import { BoardsCarouselBlock } from "@/widgets/boards-carousel";
import { WorkspacesCarouselBlock } from "@/widgets/workspaces-carousel";

export async function DashboardPage() {
  const t = await getTranslations();

  const session = await getSession();

  if (!session) redirect(ROUTES.LOGIN);

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

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
          link={<Link href={ROUTES.DASHBOARD.WORKSPACES}>{t("viewAll")}</Link>}
        />

        <BoardsCarouselBlock
          title={t("board.personal")}
          link={
            <Link
              href={ROUTES.DASHBOARD.WORKSPACE(personalWorkspace.workspace.id)}
            >
              {t("viewAll")}
            </Link>
          }
          workspace={personalWorkspace}
        />
      </div>
    </HydrationBoundary>
  );
}
