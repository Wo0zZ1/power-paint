import type { Board } from "@prisma/client";

import { AccessRole } from "@/shared/constants";
import { Card } from "@/shared/ui";
import { cn } from "@/utils";

import preview1 from "../../../../public/assets/preview1.jpeg"; // TODO Remove this hardcoded preview image

import { BoardCardBadge } from "./BoardCardBadge";
import { BoardCardFooter } from "./BoardCardFooter";
import { BoardCardHeader } from "./BoardCardHeader";
import { BoardCardImage } from "./BoardCardImage";
import { BoardCardSettingsMenu } from "./BoardCardSettingsMenu";

interface BoardCardProps {
  board: Board;
  accessRole: AccessRole;
  buttonText: string;
  onEditBoardName?: (board: Board) => void;
  onEditBoardAccess?: (board: Board) => void;
  onDeleteBoard?: (board: Board) => void;
  className?: string;
}

export function BoardCard({
  board,
  accessRole,
  buttonText,
  onEditBoardName,
  onEditBoardAccess,
  onDeleteBoard,
  className,
}: BoardCardProps) {
  const imageProps = {
    src: board.preview ?? preview1,
    alt: "Board preview image",
    fill: true,
    unoptimized: true,
    sizes: "100vw",
  } as const;

  return (
    <div className="p-0.5">
      <Card
        className={cn(
          "select-text relative h-full overflow-hidden pt-0",
          className,
        )}
      >
        <BoardCardBadge accessRole={accessRole} />

        {AccessRole[accessRole] >= AccessRole.ADMIN && (
          <BoardCardSettingsMenu
            accessRole={accessRole}
            onEditBoardName={() => onEditBoardName?.(board)}
            onEditBoardAccess={() => onEditBoardAccess?.(board)}
            onDeleteBoard={() => onDeleteBoard?.(board)}
          />
        )}

        <BoardCardImage boardId={board.id} imageProps={imageProps} />

        <BoardCardHeader className="grow" name={board.name} />

        <BoardCardFooter buttonText={buttonText} boardId={board.id} />
      </Card>
    </div>
  );
}
