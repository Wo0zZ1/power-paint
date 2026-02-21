import { Board } from "@prisma/client";
import { useState } from "react";

type setSelectedBoardFn = (board: Board) => void;

export const useChangeBoardAccess = (setSelectedBoard: setSelectedBoardFn) => {
  const [isChangeAccessModalOpen, setIsChangeAccessModalOpen] =
    useState<boolean>(false);

  const handleChangeBoardAccess = (board: Board) => {
    setSelectedBoard(board);
    setIsChangeAccessModalOpen(true);
  };

  return {
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeBoardAccess,
  };
};
