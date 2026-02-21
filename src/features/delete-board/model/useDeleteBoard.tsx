import { Board } from "@prisma/client";
import { useState } from "react";

type setSelectedBoardFn = (board: Board) => void;

export const useDeleteBoard = (setSelectedBoard: setSelectedBoardFn) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteBoard = (board: Board) => {
    setSelectedBoard(board);
    setIsDeleteModalOpen(true);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteBoard,
  };
};
