import type { Board } from "@prisma/client";

import { getSession } from "@/shared/lib/auth";
import { cn, generateRandomColor, generateRandomUsername } from "@/utils";

import type { AwarenessUser } from "../model/types";

import { KonvaBoard } from "./KonvaBoard";

interface BoardProps {
  className?: string;
  boardId: Board["id"];
}

export async function Board({ className, boardId }: BoardProps) {
  const session = await getSession();

  const user = {
    name: session?.user?.name || generateRandomUsername(),
    color: generateRandomColor(),
  } satisfies AwarenessUser;

  return (
    <div className={cn(className, "grow")}>
      <div className="w-full h-full">
        <KonvaBoard boardId={boardId} user={user} />
      </div>
    </div>
  );
}
