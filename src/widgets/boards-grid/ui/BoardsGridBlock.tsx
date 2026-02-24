import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { getBoardsQueryOption } from "@/entities/board/server";
import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspacesQueryOption } from "@/entities/workspace/server";
import { CreateBoardButton } from "@/features/create-board";
import { getQueryClient } from "@/shared/api";

import { BoardsGrid } from "./BoardsGrid";

interface BoardsGridBlockProps {
  title: string;
  workspace: WorkspaceWithAccess;
  action?: React.ReactNode;
}

export async function BoardsGridBlock({
  title,
  action,
  workspace: { workspace },
}: BoardsGridBlockProps) {
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
      <div className="flex items-end mt-12 mb-4">
        <h2 className="mr-auto text-2xl font-semibold">{title}</h2>

        <CreateBoardButton
          workspace={workspace}
          size="sm"
          className="text-sm mr-4"
        />
        {action}
      </div>

      <BoardsGrid workspace={workspace} />
    </HydrationBoundary>
  );
}
