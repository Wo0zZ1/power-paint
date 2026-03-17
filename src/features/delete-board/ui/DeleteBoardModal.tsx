"use client";

import type { Board } from "@prisma/client";
import { LucideFolder } from "lucide-react";
import { useTranslations } from "next-intl";
import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";

import { useDeleteBoardMutation } from "@/entities/board/model/mutations";
import {
  Field,
  Input,
  Button,
  Dialog,
  FieldGroup,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  Spinner,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/shared/ui";
import { cn } from "@/utils";

interface DeleteBoardModalProps {
  board?: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function DeleteBoardModal({
  board,
  open,
  onOpenChange,
  className,
}: DeleteBoardModalProps) {
  const t = useTranslations();

  const deleteBoardMutation = useDeleteBoardMutation();

  const [boardName, setBoardName] = useState<string>("");
  const [isMutating, setIsMutating] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setBoardName("");
  }, [open, setBoardName]);

  if (!board) return null;

  const handleDeleteBoard = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsMutating(true);

    deleteBoardMutation.mutateAsync(board.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onSettled: () => {
        setIsMutating(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("md:max-w-160", className)}>
        <form className="flex flex-col gap-4" onSubmit={handleDeleteBoard}>
          <DialogHeader>
            <DialogTitle>{t("board.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("board.delete.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="flex-1 gap-4 justify-end">
            <Empty className="py-1.5">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LucideFolder />
                </EmptyMedia>
                <EmptyTitle className="uppercase font-bold text-destructive">
                  {t("board.delete.warning")}
                </EmptyTitle>
                <EmptyDescription>
                  {t("board.delete.warningDescription")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>

            <Field className="gap-2">
              <label className="font-medium cursor-text" htmlFor="board-name">
                {t("board.delete.inputLabel", {
                  boardName: board.name,
                })}
              </label>
              <Input
                id="board-name"
                name="board-name"
                className="border-destructive"
                placeholder={t("board.delete.inputPlaceholder")}
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button
              disabled={boardName !== board.name || isMutating}
              className="transition-colors"
              variant="destructive"
              type="submit"
            >
              {isMutating && <Spinner />}
              {isMutating ? t("confirmation") : t("confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
