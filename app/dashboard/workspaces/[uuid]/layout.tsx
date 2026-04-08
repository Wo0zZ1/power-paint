import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getQueryClient } from "@/shared/api";
import { prisma } from "@/shared/lib/prisma";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspaceQueryOption } from "@/entities/workspace/server";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) => {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
    select: { name: true },
  });

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
