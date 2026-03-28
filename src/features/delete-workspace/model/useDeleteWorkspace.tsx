import { useState } from "react";

import type { WorkspaceWithAccess } from "@/entities/workspace";

type setSelectedWorkspaceFn = (workspace: WorkspaceWithAccess) => void;

export const useDeleteWorkspace = (
  setSelectedWorkspace: setSelectedWorkspaceFn,
) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteWorkspace = (workspace: WorkspaceWithAccess) => {
    setSelectedWorkspace(workspace);
    setIsDeleteModalOpen(true);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteWorkspace,
  };
};
