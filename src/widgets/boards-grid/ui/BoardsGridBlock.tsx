import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { getQueryClient } from "@/shared/api";

import { Button } from "@/shared/ui";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";
import { getBoardsQueryOption } from "@/entities/board/server";
import { WorkspaceWithAccess } from "@/entities/workspace";

import { CreateBoardButton } from "@/features/create-board";

import { BoardsGrid } from "./BoardsGrid";

interface BoardsGridBlockProps {
  title: string;
  workspace: WorkspaceWithAccess;
  link: React.ReactNode;
}

export async function BoardsGridBlock({
  title,
  link,
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

      <BoardsGrid workspace={workspace} />
    </HydrationBoundary>
  );
}
