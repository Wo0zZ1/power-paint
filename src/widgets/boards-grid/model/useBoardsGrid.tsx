import type { Board } from "@prisma/client";
import { useState } from "react";

import { useChangeBoardAccess } from "@/features/change-board-access";
import { useDeleteBoard } from "@/features/delete-board";
import { useRenameBoard } from "@/features/rename-board";

export const useBoardsGrid = () => {
  const [selectedBoard, setSelectedBoard] = useState<Board>();

  const { isRenameModalOpen, setIsRenameModalOpen, handleChangeBoardName } =
    useRenameBoard(setSelectedBoard);

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteBoard } =
    useDeleteBoard(setSelectedBoard);

  const {
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeBoardAccess,
  } = useChangeBoardAccess(setSelectedBoard);

  return {
    selectedBoard,
    setSelectedBoard,
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeBoardName,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteBoard,
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeBoardAccess,
  };
};
