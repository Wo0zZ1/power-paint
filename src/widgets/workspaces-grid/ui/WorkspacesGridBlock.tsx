import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { getQueryClient } from "@/shared/api";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { CreateWorkspaceButton } from "@/features/create-workspace";

import { WorkspacesGrid } from "./WorkspacesGrid";

interface WorkspacesGridBlockProps {
  title: string;
  action?: React.ReactNode;
}

export async function WorkspacesGridBlock({
  title,
  action,
}: WorkspacesGridBlockProps) {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();

  await queryClient.prefetchQuery(
    getWorkspacesQueryOption({
      cookieString: cookieStore.toString(),
      type: "team",
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="bg-accent -mx-5 p-5 rounded-2xl">
        <div className="flex items-end mb-4">
          <h2 className="mr-auto text-2xl font-semibold">{title}</h2>

          <CreateWorkspaceButton size="sm" className="text-sm mr-4" />
          {action}
        </div>

        <WorkspacesGrid />
      </div>
    </HydrationBoundary>
  );
}
