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
