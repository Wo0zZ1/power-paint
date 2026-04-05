import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getQueryClient } from "@/shared/api";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspaceQueryOption } from "@/entities/workspace/server";

export default async function Boardslayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  let workspaceWithAccess: WorkspaceWithAccess;

  try {
    workspaceWithAccess = await queryClient.fetchQuery(
      getWorkspaceQueryOption({
        workspaceId: uuid,
        cookieString: cookieStore.toString(),
      }),
    );
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h2 className="mr-auto text-2xl font-semibold">
          {workspaceWithAccess.workspace.name}
        </h2>
        {children}
      </div>
    </HydrationBoundary>
  );
}
