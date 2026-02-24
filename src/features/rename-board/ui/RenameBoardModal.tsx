"use client";

import type { Board } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { SubmitEvent} from "react";
import { useEffect, useState } from "react";

import { useUpdateBoardMutation } from "@/entities/board";
import {
  Label,
  Field,
  Input,
  Dialog,
  Button,
  FieldGroup,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  Spinner,
} from "@/shared/ui";
import { cn } from "@/utils";



interface RenameBoardModalProps {
  board?: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function RenameBoardModal({
  board,
  open,
  onOpenChange,
  className,
}: RenameBoardModalProps) {
  const t = useTranslations();

  const updateBoardMutation = useUpdateBoardMutation();

  const [boardName, setBoardName] = useState<string>("");
  const [isMutating, setIsMutating] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setBoardName(board!.name);
  }, [open, setBoardName, board]);

  const handleRenameBoard = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!board) return;

    setIsMutating(true);

    updateBoardMutation.mutate(
      {
        id: board.id,
        name: boardName,
      },
      {
        onSuccess() {
          onOpenChange(false);
        },
        onSettled: () => {
          setIsMutating(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("", className)}>
        <form className="flex flex-col gap-4" onSubmit={handleRenameBoard}>
          <DialogHeader>
            <DialogTitle>{t("board.rename.title")}</DialogTitle>
            <DialogDescription>
              {t("board.rename.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="board-name">{t("board.rename.inputLabel")}</Label>
              <Input
                autoComplete="off"
                id="board-name"
                name="board-name"
                placeholder={t("board.rename.inputPlaceholder")}
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
              disabled={boardName === board?.name || isMutating}
              className="transition-colors"
              data-icon="inline-start"
              type="submit"
            >
              {isMutating && <Spinner />}
              {isMutating
                ? t("board.rename.confirmation")
                : t("board.rename.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
