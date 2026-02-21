"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/shared/ui";

import { BoardCard, useGetBoardsQuery } from "@/entities/board";

import { RenameBoardModal } from "@/features/rename-board";
import { DeleteBoardModal } from "@/features/delete-board";
import { ChangeBoardAccessModal } from "@/features/change-board-access";
import { LoadingBoardsCarousel } from "./LoadingBoardsCarousel";
import { ErrorBoardsCarousel } from "./ErrorBoardsCarousel";

import { useBoardsCarousel } from "../model/useBoardsCarousel";

interface BoardsCarouselProps {
  className?: string;
}

export function BoardsCarousel({ className }: BoardsCarouselProps) {
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
  } = useBoardsCarousel();

  if (isLoading) return <LoadingBoardsCarousel />;

  if (isError) return <ErrorBoardsCarousel error={error} />;

  return (
    <>
      <Carousel opts={{ dragFree: true }} className={cn("", className)}>
        {data && data.length > 0 ? (
          <CarouselContent>
            {data.map(({ board, accessRole }) => (
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
