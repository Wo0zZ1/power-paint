"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { useGetWorkspacesQuery, WorkspaceCard } from "@/entities/workspace";

import { RenameWorkspaceModal } from "@/features/rename-workspace";
import { ChangeWorkspaceAccessModal } from "@/features/change-workspace-access";
import { DeleteWorkspaceModal } from "@/features/delete-workspace";

import { useWorkspacesGrid } from "../model/useWorkspacesGrid";
import { LoadingWorkspaceGrid } from "./LoadingWorkspacesGrid";
import { ErrorWorkspaceGrid } from "./ErrorWorkspacesGrid";

interface WorkspacesGridProps {
  className?: string;
}

export function WorkspacesGrid({ className }: WorkspacesGridProps) {
  const t = useTranslations();

  const { data, isLoading, isError, error } = useGetWorkspacesQuery();

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
      <div
        className={cn(
          "grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
          className,
        )}
      >
        {data && data.length > 0 ? (
          data.map(({ workspace, accessRole }) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              accessRole={accessRole}
              buttonText={t("workspace.view")}
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
