import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getSession } from "@/shared/lib/auth";
import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { WorkspacesCarouselBlock } from "@/widgets/workspaces-carousel";
import { BoardsCarouselBlock } from "@/widgets/boards-carousel";

export async function DashboardPage() {
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
        <WorkspacesCarouselBlock />

        <BoardsCarouselBlock workspace={personalWorkspace} />
      </div>
    </HydrationBoundary>
  );
}
