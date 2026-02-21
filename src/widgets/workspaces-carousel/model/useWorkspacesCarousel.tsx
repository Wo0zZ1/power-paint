import { useState } from "react";
import { Workspace } from "@prisma/client";

import { useRenameWorkspace } from "@/features/rename-workspace";
import { useChangeWorkspaceAccess } from "@/features/change-workspace-access";
import { useDeleteWorkspace } from "@/features/delete-workspace";

export const useWorkspacesCarousel = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>();

  const { isRenameModalOpen, setIsRenameModalOpen, handleChangeWorkspaceName } =
    useRenameWorkspace(setSelectedWorkspace);

  const { isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteWorkspace } =
    useDeleteWorkspace(setSelectedWorkspace);

  const {
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeWorkspaceAccess,
  } = useChangeWorkspaceAccess(setSelectedWorkspace);

  return {
    selectedWorkspace,
    setSelectedWorkspace,
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeWorkspaceName,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteWorkspace,
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeWorkspaceAccess,
  };
};
