import { AccessRole } from "@/shared/constants";
import type { Board, BoardWithAccess } from "@/shared/types";
import { Card } from "@/shared/ui";
import { cn } from "@/utils";

import { BoardCardBadge } from "./BoardCardBadge";
import { BoardCardFooter } from "./BoardCardFooter";
import { BoardCardHeader } from "./BoardCardHeader";
import { BoardCardImage } from "./BoardCardImage";
import { BoardCardSettingsMenu } from "./BoardCardSettingsMenu";

interface BoardCardProps {
  board: Board;
  accessRole: AccessRole;
  buttonText: string;
  onEditBoardName?: (board: BoardWithAccess) => void;
  onEditBoardAccess?: (board: BoardWithAccess) => void;
  onDeleteBoard?: (board: BoardWithAccess) => void;
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
    <div className="p-0.5 h-full">
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
            onEditBoardName={(accessRole) =>
              onEditBoardName?.({ board, accessRole })
            }
            onEditBoardAccess={(accessRole) =>
              onEditBoardAccess?.({ board, accessRole })
            }
            onDeleteBoard={(accessRole) =>
              onDeleteBoard?.({ board, accessRole })
            }
          />
        )}

        <BoardCardImage boardId={board.id} />

        <BoardCardHeader className="grow" name={board.name} />

        <BoardCardFooter buttonText={buttonText} boardId={board.id} />
      </Card>
    </div>
  );
}
