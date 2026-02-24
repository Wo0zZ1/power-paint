"use client";

import { useTranslations } from "next-intl";

import { useGetWorkspacesQuery, WorkspaceCard } from "@/entities/workspace";
import { ChangeWorkspaceAccessModal } from "@/features/change-workspace-access";
import { DeleteWorkspaceModal } from "@/features/delete-workspace";
import { RenameWorkspaceModal } from "@/features/rename-workspace";

import { useWorkspacesGrid } from "../model/useWorkspacesGrid";

import { ErrorWorkspaceGrid } from "./ErrorWorkspacesGrid";
import { LoadingWorkspaceGrid } from "./LoadingWorkspacesGrid";

export function WorkspacesGrid() {
  const t = useTranslations();

  const { data, isLoading, isError, error } = useGetWorkspacesQuery({
    type: "team",
  });

  const {
    selectedWorkspace,
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeWorkspaceName,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteWorkspace,
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeWorkspaceAccess,
  } = useWorkspacesGrid();

  if (isLoading) return <LoadingWorkspaceGrid />;

  if (isError) return <ErrorWorkspaceGrid error={error} />;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data && data.length > 0 ? (
          data.map(({ workspace, accessRole }) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              accessRole={accessRole}
              buttonText={t("open")}
              onEditWorkspaceName={handleChangeWorkspaceName}
              onEditWorkspaceAccess={handleChangeWorkspaceAccess}
              onDeleteWorkspace={handleDeleteWorkspace}
            />
          ))
        ) : (
          <p className="text-muted-foreground">{t("workspace.noWorkspaces")}</p>
        )}
      </div>

      <RenameWorkspaceModal
        workspace={selectedWorkspace!}
        open={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
      />

      <ChangeWorkspaceAccessModal
        workspace={selectedWorkspace}
        open={isChangeAccessModalOpen}
        onOpenChange={setIsChangeAccessModalOpen}
      />

      <DeleteWorkspaceModal
        workspace={selectedWorkspace}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  );
}
