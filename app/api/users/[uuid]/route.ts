import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";

import { getUserPublicInfo } from "@/shared/lib/utils";
import { getSession } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const user = await prisma.user.findUnique({
    where: { id: uuid },
  });

  if (!user) notFound();

  const session = await getSession();

  if (session?.user.id === user.id) return NextResponse.json(user);

  const publicUserInfo = getUserPublicInfo(user);

  return NextResponse.json(publicUserInfo);
};
