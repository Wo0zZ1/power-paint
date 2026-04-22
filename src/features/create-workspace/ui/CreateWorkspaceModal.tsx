"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/utils";

import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Dialog,
} from "@/shared/ui/dialog";
import { FieldGroup, Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";

import { useCreateWorkspaceMutation } from "@/entities/workspace/model/mutations";
import { createWorkspaceFormSchema } from "@/entities/workspace/model/schemas";
import type { CreateWorkspaceFormData } from "@/entities/workspace/model/schemas";

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
  const router = useRouter();

  const createWorkspaceMutation = useCreateWorkspaceMutation();

  const { register, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
    resolver: zodResolver(createWorkspaceFormSchema),
    disabled: createWorkspaceMutation.isPending,
  });

  const { isValid, errors, disabled } = formState;

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleCreateWorkspace = async (data: CreateWorkspaceFormData) => {
    const { workspace } = await createWorkspaceMutation.mutateAsync(data);
    router.push(ROUTES.DASHBOARD.WORKSPACE(workspace.id));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-sm", className)}>
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
              {errors.name?.message && (
                <span className="text-sm text-destructive">
                  {t(errors.name.message)}
                </span>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>

            <Button
              disabled={disabled || !isValid}
              className="transition-colors"
              data-icon="inline-start"
              type="submit"
            >
              {disabled && <Spinner />}
              <span>{disabled ? t("creating") : t("create")}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
