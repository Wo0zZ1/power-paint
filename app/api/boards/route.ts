import { unauthorized } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createBoardSchema, type BoardWithAccess } from "@/entities/board";
import { auth } from "@/shared/auth";
import { AccessRole } from "@/shared/constants";
import { getAccessToBoard } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<BoardWithAccess[]>> => {
  const searchParams = request.nextUrl.searchParams;

  const userId = searchParams.get("userId") ?? undefined;
  const workspaceId = searchParams.get("workspaceId") ?? undefined;

  const boards = await prisma.board.findMany({
    where: {
      ownerId: userId,
      workspaceId: workspaceId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const session = await auth();

  const boardsWithAccess = await Promise.all(
    boards.map(async (board) => {
      const accessRole = await getAccessToBoard(board, session?.user);

      return { board, accessRole };
    }),
  );

  const filteredBoardsWithAccess = boardsWithAccess.filter(
    (b) => AccessRole[b.accessRole] >= AccessRole.VIEWER,
  );

  return NextResponse.json(filteredBoardsWithAccess);
};

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<BoardWithAccess>> => {
  const body = await request.json();

  const { name, workspaceId, accessLevel } = z.parse(createBoardSchema, body);

  const session = await auth();

  if (!session) return unauthorized();

  const newBoard = await prisma.board.create({
    data: {
      name,
      workspaceId,
      accessLevel,
      ownerId: session.user.id,
    },
  });

  return NextResponse.json({
    board: newBoard,
    accessRole: "OWNER",
  });
};
