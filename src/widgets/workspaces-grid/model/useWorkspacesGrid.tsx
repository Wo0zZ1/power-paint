import { useState } from "react";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { useChangeWorkspaceAccess } from "@/features/change-workspace-access";
import { useDeleteWorkspace } from "@/features/delete-workspace";
import { useRenameWorkspace } from "@/features/rename-workspace";

export const useWorkspacesGrid = () => {
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceWithAccess>();

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
