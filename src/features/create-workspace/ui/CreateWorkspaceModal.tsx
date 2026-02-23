"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { cn } from "@/utils";

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
  Label,
} from "@/shared/ui";

import { useCreateWorkspaceMutation } from "@/entities/workspace";

import {
  CreateWorkspaceFormData,
  createWorkspaceFormSchema,
} from "../model/schemas";

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function CreateWorkspaceModal({
  open,
  onOpenChange,
  className,
}: CreateWorkspaceModalProps) {
  const t = useTranslations();

  const createWorkspaceMutation = useCreateWorkspaceMutation();

  const { register, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
    resolver: zodResolver(createWorkspaceFormSchema),
    disabled: createWorkspaceMutation.isPending,
  });

  const { isValid, isSubmitting } = formState;

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleCreateWorkspace = async (data: CreateWorkspaceFormData) => {
    await createWorkspaceMutation.mutateAsync(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("", className)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleCreateWorkspace)}
        >
          <DialogHeader>
            <DialogTitle>{t("workspace.create.title")}</DialogTitle>
            <DialogDescription>
              {t("workspace.create.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="workspace-name">
                {t("workspace.create.inputLabel")}
              </Label>
              <Input
                autoComplete="off"
                placeholder={t("workspace.create.inputPlaceholder")}
                id="workspace-name"
                {...register("name", { required: true })}
              />
              {formState.errors.name && (
                <span className="text-sm text-destructive">
                  {formState.errors.name.message}
                </span>
              )}
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
              {isSubmitting
                ? t("workspace.create.confirmation")
                : t("workspace.create.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
