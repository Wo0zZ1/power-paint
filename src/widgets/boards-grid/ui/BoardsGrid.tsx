"use client";

import { useTranslations } from "next-intl";

import { useGetBoardsQuery, BoardCard } from "@/entities/board";
import type { WorkspaceWithBoards } from "@/entities/workspace";
import { ChangeBoardAccessModal } from "@/features/change-board-access";
import { DeleteBoardModal } from "@/features/delete-board";
import { RenameBoardModal } from "@/features/rename-board";
import { cn } from "@/utils";

import { useBoardsGrid } from "../model/useBoardsGrid";

import { ErrorBoardGrid } from "./ErrorBoardsGrid";
import { LoadingBoardGrid } from "./LoadingBoardsGrid";

interface BoardsGridProps {
  workspace: WorkspaceWithBoards;
}

export function BoardsGrid({ workspace }: BoardsGridProps) {
  const t = useTranslations();

  const {
    data: boards,
    isLoading,
    isError,
    error,
  } = useGetBoardsQuery({
    workspaceId: workspace.id,
  });

  const {
    selectedBoard,
    isRenameModalOpen,
    setIsRenameModalOpen,
    handleChangeBoardName,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDeleteBoard,
    isChangeAccessModalOpen,
    setIsChangeAccessModalOpen,
    handleChangeBoardAccess,
  } = useBoardsGrid();

  if (isLoading) return <LoadingBoardGrid />;

  if (isError) return <ErrorBoardGrid error={error} />;

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {boards && boards.length > 0 ? (
          boards.map(({ board, accessRole }) => (
            <BoardCard
              key={board.id}
              board={board}
              accessRole={accessRole}
              buttonText={t("open")}
              onEditBoardName={handleChangeBoardName}
              onEditBoardAccess={handleChangeBoardAccess}
              onDeleteBoard={handleDeleteBoard}
            />
          ))
        ) : (
          <p className="text-muted-foreground">{t("board.empty")}</p>
        )}
      </div>

      <RenameBoardModal
        board={selectedBoard!}
        open={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
      />

      <ChangeBoardAccessModal
        board={selectedBoard}
        open={isChangeAccessModalOpen}
        onOpenChange={setIsChangeAccessModalOpen}
      />

      <DeleteBoardModal
        board={selectedBoard}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  );
}
