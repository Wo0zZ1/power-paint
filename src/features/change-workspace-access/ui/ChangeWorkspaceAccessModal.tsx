"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AccessLevel, type Workspace } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { useUpdateWorkspaceMutation } from "@/entities/workspace";
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
  FieldDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DialogDescription,
  Spinner,
} from "@/shared/ui";
import { cn } from "@/utils";

interface ChangeWorkspaceAccessModalProps {
  workspace?: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

const changeWorkspaceAccessSchema = z.object({
  accessLevel: z.enum(AccessLevel, {
    error: "Invalid access level",
  }),
});

export function ChangeWorkspaceAccessModal({
  workspace,
  open,
  onOpenChange,
  className,
}: ChangeWorkspaceAccessModalProps) {
  const t = useTranslations();

  const updateWorkspaceMutation = useUpdateWorkspaceMutation();

  const {
    formState: { isSubmitting, dirtyFields },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      accessLevel: workspace?.accessLevel || AccessLevel.private,
    },
    resolver: zodResolver(changeWorkspaceAccessSchema),
  });

  useEffect(() => {
    if (open && workspace) {
      reset({
        accessLevel: workspace.accessLevel || AccessLevel.private,
      });
    }
  }, [open, workspace, reset]);

  const handleChangeWorkspaceAccess = async (data: {
    accessLevel: AccessLevel;
  }) => {
    if (!workspace) return;

    await updateWorkspaceMutation.mutateAsync({
      id: workspace.id,
      accessLevel: data.accessLevel,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("", className)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleChangeWorkspaceAccess)}
        >
          <DialogHeader>
            <DialogTitle>{t("workspace.access.title")}</DialogTitle>

            <DialogDescription>
              {t("workspace.access.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="workspace-access">
                {t("workspace.access.inputLabel")}
              </Label>
              <FieldDescription>
                {t("workspace.access.inputDescription")}
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
