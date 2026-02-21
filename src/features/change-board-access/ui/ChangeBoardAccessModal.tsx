"use client";

import { Board } from "@prisma/client";
import { useTranslations } from "next-intl";
import { SubmitEvent, useEffect } from "react";

import { cn } from "@/utils";

import {
  Field,
  Input,
  Label,
  Button,
  Dialog,
  FieldGroup,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/shared/ui";

interface ChangeBoardAccessModalProps {
  board?: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

// TODO Implement actual access level changing functionality
export function ChangeBoardAccessModal({
  board,
  open,
  onOpenChange,
  className,
}: ChangeBoardAccessModalProps) {
  const t = useTranslations();

  useEffect(() => {}, [open, board]);

  const handleChangeBoardAccess = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO Implement access level changing logic
    console.log("Change board access");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("", className)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleChangeBoardAccess}
        >
          <DialogHeader>
            <DialogTitle>{t("board.access.title")}</DialogTitle>
            <DialogDescription>
              {t("board.access.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="board-access">Board Access</Label>
              <Input
                id="board-access"
                name="board-access"
                placeholder="Enter board access"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button type="submit">
              {false
                ? t("board.access.confirmation")
                : t("board.access.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
