import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { AccessRole } from "@/shared/constants";
import { getSession, getAccessToBoard } from "@/shared/lib/auth";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  const userId = searchParams.get("userId") || undefined;

  const boards = await prisma.board.findMany({
    where: { ownerId: userId },
    orderBy: {
      updatedAt: "desc",
    }
  });

  const session = await getSession();

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
