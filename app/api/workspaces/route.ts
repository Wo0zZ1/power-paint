import { NextRequest, NextResponse } from "next/server";
import { unauthorized } from "next/navigation";
import { AccessLevel } from "@prisma/client";
import { z } from "zod";

import { getSession, getAccessToWorkspace } from "@/shared/lib/auth";
import { AccessRole } from "@/shared/constants";
import { prisma } from "@/shared/lib/prisma";

import { WorkspaceWithAccess } from "@/entities/workspace";

import { createWorkspaceSchema } from "@/features/create-workspace";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<WorkspaceWithAccess[]>> => {
  const searchParams = request.nextUrl.searchParams;

  const userId = searchParams.get("userId") || undefined;

  const workspaces = await prisma.workspace.findMany({
    where: { ownerId: userId },
    include: {
      boards: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const session = await getSession();

  const workspacesWithAccess = await Promise.all(
    workspaces.map(async (workspace) => {
      const accessRole = await getAccessToWorkspace(workspace, session?.user);

      return { workspace, accessRole };
    }),
  );

  const filteredWorkspacesWithAccess = workspacesWithAccess.filter(
    (w) => AccessRole[w.accessRole] >= AccessRole.VIEWER,
  );

  return NextResponse.json(filteredWorkspacesWithAccess);
};

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<WorkspaceWithAccess>> => {
  const body = await request.json();

  const { name } = z.parse(createWorkspaceSchema, body);

  const session = await getSession();

  if (!session) return unauthorized();

  const newWorkspace = await prisma.workspace.create({
    data: {
      name,
      ownerId: session.user.id,
      accessLevel: AccessLevel.private, // TODO make it configurable
    },
  });

  return NextResponse.json({
    workspace: newWorkspace,
    accessRole: "OWNER",
  });
};
