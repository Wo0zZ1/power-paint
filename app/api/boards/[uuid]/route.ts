import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { AccessRole } from "@/shared/constants";
import { getAccessToBoard, getSession } from "@/shared/lib/auth";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board)
    return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const session = await getSession();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.VIEWER)
    return NextResponse.json(
      { error: "You do not have access to this board" },
      { status: 403 },
    );

  return NextResponse.json({ board, accessRole });
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const body = await request.json();

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board)
    return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const session = await getSession();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.ADMIN)
    return NextResponse.json(
      { error: "You do not have permission to edit this board" },
      { status: 403 },
    );

  const updatedBoard = await prisma.board.update({
    where: { id: uuid },
    data: {
      name: body.name,
      workspaceId: body.workspaceId,
      ownerId: body.ownerId,
      backgroundColor: body.backgroundColor,
      accessLevel: body.accessLevel,
      content: body.content,
    },
  });

  return NextResponse.json({ board: updatedBoard, accessRole });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board)
    return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const session = await getSession();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.OWNER)
    return NextResponse.json(
      { error: "You do not have permission to delete this board" },
      { status: 403 },
    );

  const updatedBoard = await prisma.board.delete({
    where: { id: uuid },
  });

  return NextResponse.json({ board: updatedBoard, accessRole });
};
