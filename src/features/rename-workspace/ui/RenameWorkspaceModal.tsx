"use client";

import { useTranslations } from "next-intl";
import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { useUpdateWorkspaceMutation } from "@/entities/workspace";
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

interface RenameWorkspaceModalProps {
  workspace?: WorkspaceWithAccess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function RenameWorkspaceModal({
  workspace,
  open,
  onOpenChange,
  className,
}: RenameWorkspaceModalProps) {
  const t = useTranslations();

  const updateWorkspaceMutation = useUpdateWorkspaceMutation();

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [isMutating, setIsMutating] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setWorkspaceName(workspace?.workspace.name ?? "");
  }, [open, setWorkspaceName, workspace]);

  const handleRenameWorkspace = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!workspace) return;

    setIsMutating(true);

    updateWorkspaceMutation.mutate(
      {
        workspaceId: workspace.workspace.id,
        data: {
          name: workspaceName,
        },
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
        <form className="flex flex-col gap-4" onSubmit={handleRenameWorkspace}>
          <DialogHeader>
            <DialogTitle>{t("workspace.rename.title")}</DialogTitle>

            <DialogDescription>
              {t("workspace.rename.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="workspace-name">
                {t("workspace.rename.inputLabel")}
              </Label>

              <Input
                autoComplete="off"
                id="workspace-name"
                name="workspace-name"
                placeholder={t("workspace.rename.inputPlaceholder")}
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
              disabled={
                workspaceName === workspace?.workspace.name || isMutating
              }
              className="transition-colors"
              data-icon="inline-start"
              type="submit"
            >
              {isMutating && <Spinner />}
              {isMutating ? t("renaming") : t("rename")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
