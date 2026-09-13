import type { Board } from "@power-paint/db";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getQueryClient } from "@/shared/api";
import { getSession } from "@/shared/session/server";
import {
  generateRandomUsername,
  generateRandomHslColor,
  cn,
} from "@/shared/lib/utils";
import type { BoardWithAccess, IGuestUserCookie } from "@/shared/types";

import { getBoardQueryOption } from "@/entities/board/server";

import type { UserAwareness } from "../model";

import { KonvaBoard } from "./KonvaBoard";

interface BoardProps {
  className?: string;
  boardId: Board["id"];
}

export async function Board({ className, boardId }: BoardProps) {
  const [session, cookieState] = await Promise.all([getSession(), cookies()]);

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
    name: session ? [session.name] : guestName,
    image: session?.image ?? null,
    color: session?.preferredColor ?? guestColor,
    id: session?.id ?? null,
  } satisfies UserAwareness;

  const { accessRole } = boardWithAccess;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cn(className, "grow min-w-0 min-h-0 overflow-hidden")}>
        <div className="w-full h-full min-w-0 min-h-0">
          <KonvaBoard
            userAwareness={userAwareness}
            boardId={boardId}
            accessRole={accessRole}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
