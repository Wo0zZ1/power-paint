import type { Board } from "@power-paint/db";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";

import { getQueryClient } from "@/shared/api";
import { GUEST_USER_COOKIE_NAME } from "@/shared/constants";
import {
  generateRandomUsername,
  generateRandomHslColor,
  cn,
  parseGuestUserCookie,
} from "@/shared/lib/utils";
import { getSession } from "@/shared/session/server";
import type { BoardWithAccess } from "@/shared/types";

import { getBoardQueryOption } from "@/entities/board/server";

import type { UserAwareness } from "../model";

import { KonvaBoard } from "./KonvaBoard";

interface BoardProps {
  className?: string;
  boardId: Board["id"];
}

export async function Board({ className, boardId }: BoardProps) {
  const [session, cookieState, headerStore] = await Promise.all([
    getSession(),
    cookies(),
    headers(),
  ]);

  const cookieString = cookieState.toString();

  const queryClient = getQueryClient();

  let boardWithAccess: BoardWithAccess;

  try {
    boardWithAccess = await queryClient.fetchQuery(
      getBoardQueryOption({
        boardId,
        cookieString,
        forwardedFor: headerStore.get("x-forwarded-for"),
      }),
    );
  } catch {
    notFound();
  }

  const parsedGuestUser = parseGuestUserCookie(
    cookieState.get(GUEST_USER_COOKIE_NAME)?.value,
  );

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
