import { useState } from "react";

import type { BoardWithAccess } from "@/shared/types";

import { useChangeBoardAccess } from "@/features/change-board-access";
import { useDeleteBoard } from "@/features/delete-board";
import { useRenameBoard } from "@/features/rename-board";

export const useBoardsCarousel = () => {
  const [selectedBoard, setSelectedBoard] = useState<BoardWithAccess>();

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
