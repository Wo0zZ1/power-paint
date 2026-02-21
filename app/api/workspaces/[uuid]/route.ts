import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { AccessRole } from "@/shared/constants";
import { getAccessToWorkspace, getSession } from "@/shared/lib/auth";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
    include: {
      boards: true,
    },
  });

  if (!workspace)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const session = await getSession();

  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.VIEWER)
    return NextResponse.json(
      { error: "You do not have access to this workspace" },
      { status: 403 },
    );

  return NextResponse.json({ workspace, accessRole });
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const body = await request.json();

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
  });

  if (!workspace)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const session = await getSession();

  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.ADMIN)
    return NextResponse.json(
      { error: "You do not have permission to edit this workspace" },
      { status: 403 },
    );

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: uuid },
    data: {
      name: body.name,
      accessLevel: body.accessLevel,
      ownerId: body.ownerId,
      type: body.type,
    },
  });

  return NextResponse.json({ workspace: updatedWorkspace, accessRole });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { id: uuid },
  });

  if (!workspace)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const session = await getSession();

  const accessRole = await getAccessToWorkspace(workspace, session?.user);

  if (AccessRole[accessRole] < AccessRole.OWNER)
    return NextResponse.json(
      { error: "You do not have permission to delete this workspace" },
      { status: 403 },
    );

  const updatedWorkspace = await prisma.workspace.delete({
    where: { id: uuid },
  });

  return NextResponse.json({ workspace: updatedWorkspace, accessRole });
};
