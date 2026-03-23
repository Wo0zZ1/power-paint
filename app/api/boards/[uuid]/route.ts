import { notFound, forbidden } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { BoardWithAccess } from "@/entities/board";
import { auth } from "@/shared/auth";
import { AccessRole } from "@/shared/constants";
import { getAccessToBoard } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<BoardWithAccess>> => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board) notFound();

  const session = await auth();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.VIEWER) forbidden();

  return NextResponse.json({ board, accessRole });
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<BoardWithAccess>> => {
  const { uuid } = await params;

  const body = await request.json();

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board) notFound();

  const session = await auth();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.ADMIN) forbidden();

  const updatedBoard = await prisma.board.update({
    where: { id: uuid },
    data: {
      name: body.name,
      workspaceId: body.workspaceId,
      ownerId: body.ownerId,
      accessLevel: body.accessLevel,
    },
  });

  return NextResponse.json({ board: updatedBoard, accessRole });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<BoardWithAccess>> => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board) notFound();

  const session = await auth();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.OWNER) forbidden();

  const updatedBoard = await prisma.board.delete({
    where: { id: uuid },
  });

  return NextResponse.json({ board: updatedBoard, accessRole });
};
