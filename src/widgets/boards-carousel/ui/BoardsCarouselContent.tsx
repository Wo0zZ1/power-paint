"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

import { BoardCard, BoardWithAccess } from "@/entities/board";

import { ChangeBoardAccessModal } from "@/features/change-board-access";
import { DeleteBoardModal } from "@/features/delete-board";
import { RenameBoardModal } from "@/features/rename-board";

import { useBoardsCarousel } from "../model/useBoardsCarousel";

interface BoardsCarouselContentProps {
  boards: BoardWithAccess[];
  className?: string;
}

export function BoardsCarouselContent({
  boards,
  className,
}: BoardsCarouselContentProps) {
  const t = useTranslations();

  const {
    handleChangeBoardName,
    handleChangeBoardAccess,
    handleDeleteBoard,
    selectedBoard,
    setIsRenameModalOpen,
    setIsChangeAccessModalOpen,
    setIsDeleteModalOpen,
    isChangeAccessModalOpen,
    isDeleteModalOpen,
    isRenameModalOpen,
  } = useBoardsCarousel();

  return (
    <>
      <Carousel opts={{ dragFree: true }} className={cn("", className)}>
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
