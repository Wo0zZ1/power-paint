import type { Workspace } from "@prisma/client";
import { useState } from "react";

type setSelectedWorkspaceFn = (workspace: Workspace) => void;

export const useDeleteWorkspace = (
  setSelectedWorkspace: setSelectedWorkspaceFn,
) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsDeleteModalOpen(true);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteWorkspace,
  };
};
