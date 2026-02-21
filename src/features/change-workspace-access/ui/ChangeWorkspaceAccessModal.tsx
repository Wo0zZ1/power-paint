"use client";

import { Workspace } from "@prisma/client";
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

interface ChangeWorkspaceAccessModalProps {
  workspace?: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

// TODO Implement actual access level changing functionality
export function ChangeWorkspaceAccessModal({
  workspace,
  open,
  onOpenChange,
  className,
}: ChangeWorkspaceAccessModalProps) {
  const t = useTranslations();

  useEffect(() => {}, [open, workspace]);

  const handleChangeWorkspaceAccess = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO Implement access level changing logic
    console.log("Change workspace access");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("", className)}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleChangeWorkspaceAccess}
        >
          <DialogHeader>
            <DialogTitle>{t("workspace.access.title")}</DialogTitle>
            <DialogDescription>
              {t("workspace.access.description")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="workspace-access">Workspace Access</Label>
              <Input
                id="workspace-access"
                name="workspace-access"
                placeholder="Enter workspace access"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button type="submit">
              {false
                ? t("workspace.access.confirmation")
                : t("workspace.access.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
