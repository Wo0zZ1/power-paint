import { useState } from "react";

import type { WorkspaceWithAccess } from "@/entities/workspace";

type setSelectedWorkspaceFn = (workspace: WorkspaceWithAccess) => void;

export const useRenameWorkspace = (
  setSelectedWorkspace: setSelectedWorkspaceFn,
) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);

  const handleChangeWorkspaceName = (workspace: WorkspaceWithAccess) => {
    setSelectedWorkspace(workspace);
    setIsRenameModalOpen(true);
  };

  return {
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeWorkspaceName,
  };
};
