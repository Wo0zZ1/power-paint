import { notFound, forbidden } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/shared/auth";
import { AccessRole } from "@/shared/constants";
import { getAccessToBoard } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import type { BoardWithAccess } from "@/shared/types";

import { updateBoardSchema } from "@/entities/board";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse<BoardWithAccess>> => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
    omit: {
      darkPreview: true,
      lightPreview: true,
    },
    include: {
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

  const { name, accessLevel, ownerId, members } = updateBoardSchema.parse(body);

  const board = await prisma.board.findUnique({
    where: { id: uuid },
    omit: {
      darkPreview: true,
      lightPreview: true,
    },
  });

  if (!board) notFound();

  const session = await auth();
  const accessRole = await getAccessToBoard(board, session?.user);

  if (AccessRole[accessRole] < AccessRole.ADMIN) forbidden();

  const membersPayload =
    members?.map((m) => ({
      userId: m.userId,
      role: m.role,
    })) ?? [];

  const updatedBoard = await prisma.board.update({
    where: { id: uuid },
    omit: {
      darkPreview: true,
      lightPreview: true,
    },
    data: {
      name,
      accessLevel,
      ownerId,
      members: {
        deleteMany: {},
        create: membersPayload,
      },
    },
    include: {
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

  return NextResponse.json({ board: updatedBoard, accessRole });
};

export const DELETE = async (
  _: NextRequest,
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
    omit: {
      darkPreview: true,
      lightPreview: true,
    },
    include: {
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

  return NextResponse.json({ board: updatedBoard, accessRole });
};
