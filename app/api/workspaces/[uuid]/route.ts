import { NextRequest, NextResponse } from "next/server";
import { forbidden, notFound } from "next/navigation";
import { WorkspaceType } from "@prisma/client";

import { getAccessToWorkspace, getSession } from "@/shared/lib/auth";
import { AccessRole } from "@/shared/constants";
import { prisma } from "@/shared/lib/prisma";

import { WorkspaceWithAccess } from "@/entities/workspace";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<WorkspaceWithAccess>> => {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
    include: { boards: true },
  });

  if (!workspace) return notFound();

  const session = await getSession();

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

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
  });

  if (!workspace) notFound();

  if (workspace.type === WorkspaceType.personal) forbidden();

  const session = await getSession();

  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.ADMIN) forbidden();

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: uuid },
    data: {
      name: body.name,
      accessLevel: body.accessLevel,
      ownerId: body.ownerId,
      type: body.type,
    },
    include: { boards: true },
  });

  return NextResponse.json({ workspace: updatedWorkspace, accessRole });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<WorkspaceWithAccess>> => {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
  });

  if (!workspace) notFound();

  if (workspace.type === WorkspaceType.personal) forbidden();

  const session = await getSession();

  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.OWNER) forbidden();

  const updatedWorkspace = await prisma.workspace.delete({
    where: { id: uuid },
    include: { boards: true },
  });

  return NextResponse.json({ workspace: updatedWorkspace, accessRole });
};
