import { WorkspaceType } from "@prisma/client";
import { forbidden, notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  updateWorkspaceSchema,
  type WorkspaceWithAccess,
} from "@/entities/workspace";
import { auth } from "@/shared/auth";
import { AccessRole } from "@/shared/constants";
import { getAccessToWorkspace } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<WorkspaceWithAccess>> => {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
    include: {
      boards: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              created_at: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) return notFound();

  const session = await auth();

  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.VIEWER) forbidden();

  return NextResponse.json({ workspace, accessRole });
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<WorkspaceWithAccess>> => {
  const { uuid } = await params;

  const body = await request.json();

  const { name, accessLevel, ownerId, members } =
    updateWorkspaceSchema.parse(body);

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
  });

  if (!workspace) notFound();
  if (workspace.type === WorkspaceType.personal) forbidden();

  const session = await auth();
  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.ADMIN) forbidden();

  const membersPayload =
    members?.map((m) => ({
      userId: m.userId,
      role: m.role,
    })) ?? [];

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: uuid },
    data: {
      name,
      accessLevel,
      ownerId,
      members: {
        deleteMany: {},
        create: membersPayload,
      },
      type: body.type,
    },
    include: {
      boards: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              created_at: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ workspace: updatedWorkspace, accessRole });
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<WorkspaceWithAccess>> => {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
  });

  if (!workspace) notFound();

  if (workspace.type === WorkspaceType.personal) forbidden();

  const session = await auth();

  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.OWNER) forbidden();

  const updatedWorkspace = await prisma.workspace.delete({
    where: { id: uuid },
    include: {
      boards: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              created_at: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ workspace: updatedWorkspace, accessRole });
};
