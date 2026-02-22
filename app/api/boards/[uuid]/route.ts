import { NextRequest, NextResponse } from "next/server";
import { notFound, forbidden } from "next/navigation";

import { prisma } from "@/shared/lib/prisma";
import { AccessRole } from "@/shared/constants";
import { getAccessToBoard, getSession } from "@/shared/lib/auth";

import { BoardWithAccess } from "@/entities/board";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<BoardWithAccess>> => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board) notFound();

  const session = await getSession();

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

  const session = await getSession();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.ADMIN) forbidden();

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
): Promise<NextResponse<BoardWithAccess>> => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
  });

  if (!board) notFound();

  const session = await getSession();

  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.OWNER) forbidden();

  const updatedBoard = await prisma.board.delete({
    where: { id: uuid },
  });

  return NextResponse.json({ board: updatedBoard, accessRole });
};
