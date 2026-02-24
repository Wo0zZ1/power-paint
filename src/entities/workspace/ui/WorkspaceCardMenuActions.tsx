"use client";

import { PencilLine, Share2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AccessRole } from "@/shared/constants";
import { DropdownMenuGroup, DropdownMenuItem, Separator } from "@/shared/ui";

interface WorkspaceCardMenuActionsProps {
  accessRole: AccessRole;
  onEditWorkspaceName?: () => void;
  onEditWorkspaceAccess?: () => void;
  onDeleteWorkspace?: () => void;
}

export function WorkspaceCardMenuActions({
  accessRole,
  onEditWorkspaceName,
  onEditWorkspaceAccess,
  onDeleteWorkspace,
}: WorkspaceCardMenuActionsProps) {
  const t = useTranslations("workspace");

  return (
    <>
      <DropdownMenuGroup>
        {AccessRole[accessRole] >= AccessRole.ADMIN && (
          <DropdownMenuItem onSelect={onEditWorkspaceName}>
            <PencilLine />
            {t("rename.action")}
          </DropdownMenuItem>
        )}

        {AccessRole[accessRole] >= AccessRole.ADMIN && (
          <DropdownMenuItem onSelect={onEditWorkspaceAccess}>
            <Share2 />
            {t("access.action")}
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>

      {AccessRole[accessRole] >= AccessRole.OWNER && (
        <>
          <Separator className="my-1" />

          <DropdownMenuItem onSelect={onDeleteWorkspace} variant="destructive">
            <Trash2 />
            {t("delete.action")}
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
