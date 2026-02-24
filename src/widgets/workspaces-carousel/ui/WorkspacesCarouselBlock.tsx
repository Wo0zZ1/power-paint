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
  link: ReactNode;
}

export async function WorkspacesCarouselBlock({
  title,
  link,
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
          <h3 className="mr-auto text-2xl font-semibold">{title}</h3>

          <CreateWorkspaceButton size="sm" className="text-sm mr-4" />
          <Button size="xs" variant="link" className="text-sm" asChild>
            {link}
          </Button>
        </div>

        <WorkspacesCarousel />
      </div>
    </HydrationBoundary>
  );
}
