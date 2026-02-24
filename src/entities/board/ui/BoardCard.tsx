import { Board } from "@prisma/client";

import { cn } from "@/utils";
import { AccessRole } from "@/shared/constants";

import { Card } from "@/shared/ui";

import { BoardCardBadge } from "./BoardCardBadge";
import { BoardCardImage } from "./BoardCardImage";
import { BoardCardHeader } from "./BoardCardHeader";
import { BoardCardFooter } from "./BoardCardFooter";
import { BoardCardSettingsMenu } from "./BoardCardSettingsMenu";

import preview1 from "../../../../public/assets/preview1.jpeg"; // TODO Remove this hardcoded preview image

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
  return (
    <Card
      className={cn("select-text relative h-full overflow-hidden", className)}
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

      <BoardCardImage boardId={board.id} imageProps={preview1} />

      <BoardCardHeader name={board.name} />

      <BoardCardFooter buttonText={buttonText} boardId={board.id} />
    </Card>
  );
}
