import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getUserPublicInfo } from "@/entities/user";
import { auth } from "@/shared/auth";
import { prisma } from "@/shared/lib/prisma";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const user = await prisma.user.findUnique({
    where: { id: uuid },
  });

  if (!user) notFound();

  const session = await auth();

  if (session?.user.id === user.id) return NextResponse.json(user);

  const publicUserInfo = getUserPublicInfo(user);

  return NextResponse.json(publicUserInfo);
};
