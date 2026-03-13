import type { Board } from "@prisma/client";

import { cn } from "@/utils";

import { KonvaBoard } from "./KonvaBoard";

interface BoardProps {
  className?: string;
  boardId: Board["id"];
}

export async function Board({ className, boardId }: BoardProps) {
  return (
    <div className={cn(className, "grow")}>
      <div className="w-full h-full">
        <KonvaBoard boardId={boardId} />
      </div>
    </div>
  );
}
