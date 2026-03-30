import { useState } from "react";

import type { BoardWithAccess } from "@/entities/board";

type setSelectedBoardFn = (board: BoardWithAccess) => void;

export const useDeleteBoard = (setSelectedBoard: setSelectedBoardFn) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteBoard = (board: BoardWithAccess) => {
    setSelectedBoard(board);
    setIsDeleteModalOpen(true);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteBoard,
  };
};
