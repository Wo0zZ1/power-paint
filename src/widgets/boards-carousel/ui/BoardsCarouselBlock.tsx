import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";

import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";

import { Button } from "@/shared/ui";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";
import { getBoardsQueryOption } from "@/entities/board/server";
import { WorkspaceWithAccess } from "@/entities/workspace";

import { CreateBoardButton } from "@/features/create-board";

import { BoardsCarousel } from "./BoardsCarousel";

interface BoardsCarouselBlockProps {
  workspace: WorkspaceWithAccess;
}

export async function BoardsCarouselBlock({
  workspace: { workspace },
}: BoardsCarouselBlockProps) {
  const t = await getTranslations();

  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(
    getBoardsQueryOption({
      cookieString: cookieStore.toString(),
      workspaceId: workspace.id,
    }),
  );

  await queryClient.prefetchQuery(
    getWorkspacesQueryOption({ cookieString: cookieStore.toString() }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <div className="flex items-end mt-12 mb-4">
          <h3 className="mr-auto text-2xl font-semibold">
            {t("board.plural")}
          </h3>

          <CreateBoardButton
            workspace={workspace}
            size="sm"
            className="text-sm mr-4"
          />
          <Button size="xs" variant="link" className="text-sm" asChild>
            <Link href={ROUTES.DASHBOARD.BOARDS(workspace.id)}>
              {t("viewAll")}
            </Link>
          </Button>
        </div>

        <BoardsCarousel workspace={workspace} />
      </div>
    </HydrationBoundary>
  );
}
