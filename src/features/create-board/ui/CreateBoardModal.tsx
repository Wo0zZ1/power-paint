"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Workspace } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import type { CreateBoardFormData } from "@/entities/board";
import {
  getCreateBoardFormSchema,
  useCreateBoardMutation,
} from "@/entities/board";
import { useGetWorkspacesQuery } from "@/entities/workspace";
import { ROUTES } from "@/shared/config";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  FieldGroup,
  Field,
  Input,
  DialogFooter,
  DialogClose,
  Button,
  Spinner,
  Dialog,
  Select,
  FieldLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";
import { cn } from "@/utils";

interface CreateBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace;
  className?: string;
}

export function CreateBoardModal({
  open,
  onOpenChange,
  workspace,
  className,
}: CreateBoardModalProps) {
  const t = useTranslations();
  const router = useRouter();

  const { data, isLoading, isError, error } = useGetWorkspacesQuery();
  const createBoardMutation = useCreateBoardMutation();

  const workspaces = data?.map((wa) => wa.workspace) ?? [];
  const workspaceIds = workspaces?.map((w) => w.id) ?? [];
  const createBoardSchema = getCreateBoardFormSchema(workspaceIds);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      workspaceId: workspace.id,
    },
    resolver: zodResolver(createBoardSchema),
    disabled: createBoardMutation.isPending,
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleCreateBoard = useCallback(
    async (data: CreateBoardFormData) => {
      const { board } = await createBoardMutation.mutateAsync(data);
      router.push(ROUTES.BOARD(board.id));
      onOpenChange(false);
    },
    [createBoardMutation, onOpenChange, router],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-sm", className)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleCreateBoard)}
        >
          <DialogHeader>
            <DialogTitle>{t("board.create.title")}</DialogTitle>
            <DialogDescription>
              {t("board.create.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="board-name">
                {t("board.create.nameInputLabel")}
              </FieldLabel>
              <Input
                autoComplete="off"
                placeholder={t("board.create.nameInputPlaceholder")}
                aria-invalid={!!errors.name}
                id="board-name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-sm text-destructive">
                  {errors.name.message}
                </span>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="board-workspace">
                {t("board.create.workspaceInputLabel")}
              </FieldLabel>

              <Controller
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "board.create.workspaceInputPlaceholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {isLoading && <div>Loading...</div>}
                      {isError && (
                        <div className="text-sm text-destructive">
                          {error instanceof Error
                            ? error.message
                            : "An error occurred"}
                        </div>
                      )}
                      {!isLoading &&
                        !isError &&
                        workspaces.map((workspace) => (
                          <SelectItem key={workspace.id} value={workspace.id}>
                            {workspace.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                    {errors.workspaceId && (
                      <span className="text-sm text-destructive">
                        {errors.workspaceId.message}
                      </span>
                    )}
                  </Select>
                )}
                control={control}
                name="workspaceId"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>

            <Button
              disabled={isSubmitting || !isValid}
              className="transition-colors"
              data-icon="inline-start"
              type="submit"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
