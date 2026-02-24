import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { getBoardsQueryOption } from "@/entities/board/server";
import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspacesQueryOption } from "@/entities/workspace/server";
import { CreateBoardButton } from "@/features/create-board";
import { getQueryClient } from "@/shared/api";
import { Button } from "@/shared/ui";

import { BoardsCarousel } from "./BoardsCarousel";

interface BoardsCarouselBlockProps {
  title: string;
  workspace: WorkspaceWithAccess;
  link: ReactNode;
}

export async function BoardsCarouselBlock({
  workspace: { workspace },
  title,
  link,
}: BoardsCarouselBlockProps) {
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
          <h3 className="mr-auto text-2xl font-semibold">{title}</h3>

          <CreateBoardButton
            workspace={workspace}
            size="sm"
            className="text-sm mr-4"
          />
          <Button size="xs" variant="link" className="text-sm" asChild>
            {link}
          </Button>
        </div>

        <BoardsCarousel workspace={workspace} />
      </div>
    </HydrationBoundary>
  );
}
