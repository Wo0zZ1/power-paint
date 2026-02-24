import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";
import { CreateWorkspaceButton } from "@/features/create-workspace";
import { getQueryClient } from "@/shared/api";
import { Button } from "@/shared/ui";

import { WorkspacesCarousel } from "./WorkspacesCarousel";

interface WorkspacesCarouselBlockProps {
  title: string;
  action: ReactNode;
}

export async function WorkspacesCarouselBlock({
  title,
  action,
}: WorkspacesCarouselBlockProps) {
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
      <div>
        <div className="flex items-end mt-12 mb-4">
          <h2 className="mr-auto text-2xl font-semibold">{title}</h2>

          <CreateWorkspaceButton size="sm" className="text-sm mr-4" />
            {action}
        </div>

        <WorkspacesCarousel />
      </div>
    </HydrationBoundary>
  );
}
