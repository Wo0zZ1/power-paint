import { useState } from "react";

import type { BoardWithAccess } from "@/shared/types";

type setSelectedBoardFn = (board: BoardWithAccess) => void;

export const useChangeBoardAccess = (setSelectedBoard: setSelectedBoardFn) => {
  const [isChangeAccessModalOpen, setIsChangeAccessModalOpen] =
    useState<boolean>(false);

  const handleChangeBoardAccess = (board: BoardWithAccess) => {
    setSelectedBoard(board);
    setIsChangeAccessModalOpen(true);
  };

  return {
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeBoardAccess,
  };
};
