import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { getQueryClient } from "@/shared/api";
import { AccessRole } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";

import { getBoardsQueryOption } from "@/entities/board/server";
import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { CreateBoardButton } from "@/features/create-board";

import { BoardsCarousel } from "./BoardsCarousel";

interface BoardsCarouselBlockProps {
  title: string;
  action?: ReactNode;
  className?: string;
  workspaceWithAccess: WorkspaceWithAccess;
}

export async function BoardsCarouselBlock({
  title,
  action,
  className,
  workspaceWithAccess,
}: BoardsCarouselBlockProps) {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  const { workspace, accessRole } = workspaceWithAccess;

  await queryClient.prefetchQuery(
    getBoardsQueryOption({
      workspaceId: workspace.id,
      cookieString: cookieStore.toString(),
    }),
  );

  await queryClient.prefetchQuery(
    getWorkspacesQueryOption({ cookieString: cookieStore.toString() }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cn("bg-accent -mx-5 p-5 rounded-2xl", className)}>
        <div className="flex items-end mb-4">
          <h2 className="mr-auto text-2xl font-semibold">{title}</h2>

          {AccessRole[accessRole] >= AccessRole.ADMIN && (
            <CreateBoardButton
              workspace={workspace}
              size="sm"
              className="text-sm mr-4"
            />
          )}

          {action}
        </div>

        <BoardsCarousel workspace={workspace} />
      </div>
    </HydrationBoundary>
  );
}
