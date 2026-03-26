import type { Board } from "@prisma/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import type { BoardWithAccess } from "@/entities/board";
import { getBoardQueryOption } from "@/entities/board/server";
import { getQueryClient } from "@/shared/api";
import { auth } from "@/shared/auth";
import {
  generateRandomUsername,
  generateRandomHslColor,
  cn,
} from "@/shared/lib/utils";
import type { IGuestUserCookie } from "@/shared/types";

import type { UserAwareness } from "../model";
import { generateWsToken } from "../model/lib/token";

import { KonvaBoard } from "./KonvaBoard";

interface BoardProps {
  className?: string;
  boardId: Board["id"];
}

export async function Board({ className, boardId }: BoardProps) {
  const session = await auth();

  const cookieState = await cookies();
  const cookieString = cookieState.toString();

  const queryClient = getQueryClient();

  let boardWithAccess: BoardWithAccess;

  try {
    boardWithAccess = await queryClient.fetchQuery(
      getBoardQueryOption({ boardId, cookieString }),
    );
  } catch {
    notFound();
  }

  const guestUser = cookieState.get("guest-user")?.value;
  const parsedGuestUser = guestUser
    ? (JSON.parse(
        Buffer.from(guestUser, "base64").toString(),
      ) as IGuestUserCookie)
    : null;

  const guestName = parsedGuestUser?.name ?? generateRandomUsername();
  const guestColor = parsedGuestUser?.color ?? generateRandomHslColor();

  const userAwareness = {
    name: session ? [session.user.name] : guestName,
    image: session?.user.image ?? null,
    color: session?.user.preferredColor ?? guestColor,
    id: session?.user.id ?? null,
  } satisfies UserAwareness;

  const { accessRole } = boardWithAccess;
  const accessToken = await generateWsToken({
    user: {
      name: userAwareness.name,
      color: userAwareness.color,
      id: session?.user.id,
      email: session?.user.email,
      image: session?.user.image,
    },
    accessRole,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cn(className, "grow min-w-0 min-h-0 overflow-hidden")}>
        <div className="w-full h-full min-w-0 min-h-0">
          <KonvaBoard
            userAwareness={userAwareness}
            accessToken={accessToken}
            boardId={boardId}
            accessRole={accessRole}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
