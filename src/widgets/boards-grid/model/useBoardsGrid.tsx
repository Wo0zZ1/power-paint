import { useState } from "react";
import { Board } from "@prisma/client";

import { useRenameBoard } from "@/features/rename-board";
import { useChangeBoardAccess } from "@/features/change-board-access";
import { useDeleteBoard } from "@/features/delete-board";

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
