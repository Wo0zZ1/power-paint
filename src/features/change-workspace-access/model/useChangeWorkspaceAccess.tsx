import { useState } from "react";

import type { WorkspaceWithAccess } from "@/entities/workspace";

type setSelectedWorkspaceFn = (workspace: WorkspaceWithAccess) => void;

export const useChangeWorkspaceAccess = (
  setSelectedWorkspace: setSelectedWorkspaceFn,
) => {
  const [isChangeAccessModalOpen, setIsChangeAccessModalOpen] =
    useState<boolean>(false);

  const handleChangeWorkspaceAccess = (workspace: WorkspaceWithAccess) => {
    setSelectedWorkspace(workspace);
    setIsChangeAccessModalOpen(true);
  };

  return {
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeWorkspaceAccess,
  };
};
