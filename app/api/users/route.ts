import type { User } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getUserPublicInfo } from "@/entities/user";
import { prisma } from "@/shared/lib/prisma";

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get("q");

  let users: User[] = [];

  if (query) {
    users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      orderBy: { name: "asc" },
    });
  } else {
    users = await prisma.user.findMany({
      take: 10,
      orderBy: { name: "asc" },
    });
  }

  const publicUsers = users.map(getUserPublicInfo);
  return NextResponse.json(publicUsers);
};
