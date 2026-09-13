import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

import { getQueryClient } from "@/shared/api";
import { cn } from "@/shared/lib/utils";

import { getWorkspacesQueryOption } from "@/entities/workspace/server";

import { CreateWorkspaceButton } from "@/features/create-workspace";

import { WorkspacesCarousel } from "./WorkspacesCarousel";

interface WorkspacesCarouselBlockProps {
  title: string;
  action: ReactNode;
  className?: string;
}

export async function WorkspacesCarouselBlock({
  title,
  action,
  className,
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
      <div className={cn("bg-accent p-3 xs:p-4 md:p-5 rounded-2xl", className)}>
        <div className="flex flex-col-reverse sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>

          <div className="flex gap-4 items-center sm:items-end self-end sm:self-auto">
            <CreateWorkspaceButton size="sm" className="text-sm" />
            {action}
          </div>
        </div>

        <WorkspacesCarousel className="col-span-2" />
      </div>
    </HydrationBoundary>
  );
}
