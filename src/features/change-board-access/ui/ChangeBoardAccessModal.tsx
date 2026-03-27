"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AccessLevel, type Board } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { useUpdateBoardMutation } from "@/entities/board";
import { ACCESS_LEVELS } from "@/shared/constants";
import {
  Field,
  Label,
  Button,
  Dialog,
  FieldGroup,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FieldDescription,
  DialogDescription,
  Spinner,
} from "@/shared/ui";
import { cn } from "@/utils";

interface ChangeBoardAccessModalProps {
  board?: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

const changeBoardAccessSchema = z.object({
  accessLevel: z.enum(AccessLevel, {
    error: "Invalid access level",
  }),
});

export function ChangeBoardAccessModal({
  board,
  open,
  onOpenChange,
  className,
}: ChangeBoardAccessModalProps) {
  const t = useTranslations();

  const updateBoardMutation = useUpdateBoardMutation();

  const {
    formState: { isSubmitting, dirtyFields },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      accessLevel: board?.accessLevel || AccessLevel.private,
    },
    resolver: zodResolver(changeBoardAccessSchema),
  });

  useEffect(() => {
    if (open && board) {
      reset({
        accessLevel: board.accessLevel || AccessLevel.private,
      });
    }
  }, [open, board, reset]);

  const handleChangeBoardAccess = async (data: {
    accessLevel: AccessLevel;
  }) => {
    if (!board) return;

    await updateBoardMutation.mutateAsync({
      id: board.id,
      accessLevel: data.accessLevel,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("", className)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleChangeBoardAccess)}
        >
          <DialogHeader>
            <DialogTitle>{t("board.access.title")}</DialogTitle>

            <DialogDescription>
              {t("board.access.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="board-access">
                {t("board.access.inputLabel")}
              </Label>
              <FieldDescription>
                {t("board.access.inputDescription")}
              </FieldDescription>

              <Controller
                name="accessLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {t(`accessLevels.${field.value}`)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ACCESS_LEVELS.map(({ value, translationKey }) => (
                        <SelectItem key={value} value={value}>
                          {t(translationKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || !dirtyFields.accessLevel}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? t("savingChanges") : t("saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
