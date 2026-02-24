import type { Workspace } from "@prisma/client";
import { useState } from "react";

type setSelectedWorkspaceFn = (workspace: Workspace) => void;

export const useRenameWorkspace = (
  setSelectedWorkspace: setSelectedWorkspaceFn,
) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);

  const handleChangeWorkspaceName = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsRenameModalOpen(true);
  };

  return {
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeWorkspaceName,
  };
};
