import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getQueryClient } from "@/shared/api";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import {
  fetchWorkspaceMeta,
  getWorkspaceQueryOption,
} from "@/entities/workspace/server";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const [{ uuid }, headerStore] = await Promise.all([params, headers()]);

  const workspace = await fetchWorkspaceMeta({
    workspaceId: uuid,
    forwardedFor: headerStore.get("x-forwarded-for"),
  }).catch(() => null);

  if (!workspace)
    return {
      title: "Workspace not found",
      description: "The workspace you are looking for does not exist.",
    } satisfies Metadata;

  return {
    title: `${workspace.name} - Workspace`,
    description: `Workspace page for ${workspace.name}`,
  } satisfies Metadata;
};

export default async function Boardslayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
}) {
  const [{ uuid }, cookieStore] = await Promise.all([params, cookies()]);

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
