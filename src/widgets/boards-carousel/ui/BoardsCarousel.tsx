"use client";

import { useTranslations } from "next-intl";

import { BoardCard, useGetBoardsQuery } from "@/entities/board";
import type { Workspace } from "@/entities/workspace";
import { ChangeBoardAccessModal } from "@/features/change-board-access";
import { DeleteBoardModal } from "@/features/delete-board";
import { RenameBoardModal } from "@/features/rename-board";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/shared/ui";

import { useBoardsCarousel } from "../model/useBoardsCarousel";

import { ErrorBoardsCarousel } from "./ErrorBoardsCarousel";
import { LoadingBoardsCarousel } from "./LoadingBoardsCarousel";

interface BoardsCarouselProps {
  workspace: Workspace;
}

export function BoardsCarousel({ workspace }: BoardsCarouselProps) {
  const t = useTranslations();

  const {
    data: boards,
    isLoading,
    isError,
    error,
  } = useGetBoardsQuery({ workspaceId: workspace.id });

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
  } = useBoardsCarousel();

  if (isLoading) return <LoadingBoardsCarousel />;

  if (isError) return <ErrorBoardsCarousel error={error} />;

  return (
    <>
      <Carousel opts={{ dragFree: true }}>
        {boards && boards.length > 0 ? (
          <CarouselContent>
            {boards.map(({ board, accessRole }) => (
              <CarouselItem
                key={board.id}
                className="basis-1/1 xs:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
              >
                <BoardCard
                  board={board}
                  accessRole={accessRole}
                  buttonText={t("open")}
                  onEditBoardName={handleChangeBoardName}
                  onEditBoardAccess={handleChangeBoardAccess}
                  onDeleteBoard={handleDeleteBoard}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        ) : (
          <div className="text-muted-foreground">{t("board.empty")}</div> // TODO add empty state design
        )}

        <CarouselPrevious
          variant="secondary"
          className="bg-secondary/75 left-6 size-10"
        />

        <CarouselNext
          variant="secondary"
          className="bg-secondary/75 right-6 size-10"
        />
      </Carousel>

      <RenameBoardModal
        key={`rename-${selectedBoard?.board.id}`}
        board={selectedBoard}
        open={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
      />

      <ChangeBoardAccessModal
        key={`change-access-${selectedBoard?.board.id}`}
        board={selectedBoard}
        open={isChangeAccessModalOpen}
        onOpenChange={setIsChangeAccessModalOpen}
      />

      <DeleteBoardModal
        key={`delete-${selectedBoard?.board.id}`}
        board={selectedBoard}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  );
}
