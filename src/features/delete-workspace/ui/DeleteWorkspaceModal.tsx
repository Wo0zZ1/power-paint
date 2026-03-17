"use client";

import type { Workspace } from "@prisma/client";
import { LucideFolder } from "lucide-react";
import { useTranslations } from "next-intl";
import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";

import { useDeleteWorkspaceMutation } from "@/entities/workspace/model/mutations";
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

interface DeleteWorkspaceModalProps {
  workspace?: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function DeleteWorkspaceModal({
  workspace,
  open,
  onOpenChange,
  className,
}: DeleteWorkspaceModalProps) {
  const t = useTranslations("");

  const deleteWorkspaceMutation = useDeleteWorkspaceMutation();

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [isMutating, setIsMutating] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setWorkspaceName("");
  }, [open, setWorkspaceName]);

  if (!workspace) return null;

  const handleDeleteWorkspace = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsMutating(true);

    deleteWorkspaceMutation.mutateAsync(workspace.id, {
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
        <form className="flex flex-col gap-4" onSubmit={handleDeleteWorkspace}>
          <DialogHeader>
            <DialogTitle>{t("workspace.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("workspace.delete.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="flex-1 gap-4 justify-end">
            <Empty className="py-1.5">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LucideFolder />
                </EmptyMedia>
                <EmptyTitle className="uppercase font-bold text-destructive">
                  {t("workspace.delete.warning")}
                </EmptyTitle>
                <EmptyDescription>
                  {t("workspace.delete.warningDescription")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>

            <Field className="gap-2">
              <label
                className="font-medium cursor-text"
                htmlFor="workspace-name"
              >
                {t("workspace.delete.inputLabel", {
                  workspaceName: workspace.name,
                })}
              </label>
              <Input
                id="workspace-name"
                name="workspace-name"
                className="border-destructive"
                placeholder={t("workspace.delete.inputPlaceholder")}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button
              disabled={workspaceName !== workspace.name || isMutating}
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
