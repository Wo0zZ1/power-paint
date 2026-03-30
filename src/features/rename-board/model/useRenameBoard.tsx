import { useState } from "react";

import type { BoardWithAccess } from "@/entities/board";

type setSelectedBoardFn = (board: BoardWithAccess) => void;

export const useRenameBoard = (setSelectedBoard: setSelectedBoardFn) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);

  const handleChangeBoardName = (board: BoardWithAccess) => {
    setSelectedBoard(board);
    setIsRenameModalOpen(true);
  };

  return {
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeBoardName,
  };
};
