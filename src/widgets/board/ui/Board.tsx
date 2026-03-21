import type { Board } from "@prisma/client";
import { cookies } from "next/headers";

import { auth } from "@/shared/auth";
import type { IGuestUserCookie } from "@/shared/types";
import { cn, generateRandomColor, generateRandomUsername } from "@/utils";

import type { AwarenessUser } from "../model/types";

import { KonvaBoard } from "./KonvaBoard";

export const revalidate = 0;
export const dyanamic = "force-dynamic";

interface BoardProps {
  className?: string;
  boardId: Board["id"];
}

export async function Board({ className, boardId }: BoardProps) {
  const session = await auth();

  const cookieState = await cookies();

  const guestUser = cookieState.get("guest-user")?.value;
  const parsedGuestUser = guestUser
    ? (JSON.parse(
        Buffer.from(guestUser, "base64").toString(),
      ) as IGuestUserCookie)
    : null;

  const guestName = parsedGuestUser?.name ?? generateRandomUsername();
  const guestColor = parsedGuestUser?.color ?? generateRandomColor();

  const user = {
    guest: !session,
    name: session ? [session.user.name] : guestName,
    color: session?.user.preferredColor ?? guestColor,
  } satisfies AwarenessUser;

  return (
    <div className={cn(className, "grow min-w-0 min-h-0 overflow-hidden")}>
      <div className="w-full h-full min-w-0 min-h-0">
        <KonvaBoard boardId={boardId} user={user} />
      </div>
    </div>
  );
}
