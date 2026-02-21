"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import { useGetBoardsQuery, BoardCard } from "@/entities/board";

import { RenameBoardModal } from "@/features/rename-board";
import { ChangeBoardAccessModal } from "@/features/change-board-access";
import { DeleteBoardModal } from "@/features/delete-board";

import { useBoardsGrid } from "../model/useBoardsGrid";
import { LoadingBoardGrid } from "./LoadingBoardsGrid";
import { ErrorBoardGrid } from "./ErrorBoardsGrid";

interface BoardsGridProps {
  className?: string;
}

export function BoardsGrid({ className }: BoardsGridProps) {
  const t = useTranslations();

  const { data, isLoading, isError, error } = useGetBoardsQuery();

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
          className,
        )}
      >
        {data && data.length > 0 ? (
          data.map(({ board, accessRole }) => (
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
