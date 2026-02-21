import { Workspace } from "@prisma/client";
import { useState } from "react";

type setSelectedWorkspaceFn = (workspace: Workspace) => void;

export const useChangeWorkspaceAccess = (
  setSelectedWorkspace: setSelectedWorkspaceFn,
) => {
  const [isChangeAccessModalOpen, setIsChangeAccessModalOpen] =
    useState<boolean>(false);

  const handleChangeWorkspaceAccess = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsChangeAccessModalOpen(true);
  };

  return {
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeWorkspaceAccess,
  };
};
