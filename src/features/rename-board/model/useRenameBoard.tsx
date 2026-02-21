import { Board } from "@prisma/client";
import { useState } from "react";

type setSelectedBoardFn = (board: Board) => void;

export const useRenameBoard = (setSelectedBoard: setSelectedBoardFn) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);

  const handleChangeBoardName = (board: Board) => {
    setSelectedBoard(board);
    setIsRenameModalOpen(true);
  };

  return {
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeBoardName,
  };
};
