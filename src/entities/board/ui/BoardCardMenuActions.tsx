"use client";

import { PencilLine, Share2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AccessRole } from "@/shared/constants";
import { DropdownMenuGroup, DropdownMenuItem, Separator } from "@/shared/ui";

interface BoardCardMenuActionsProps {
  accessRole: AccessRole;
  onEditBoardName?: () => void;
  onEditBoardAccess?: () => void;
  onDeleteBoard?: () => void;
}

export function BoardCardMenuActions({
  accessRole,
  onEditBoardName,
  onEditBoardAccess,
  onDeleteBoard,
}: BoardCardMenuActionsProps) {
  const t = useTranslations("board");

  return (
    <>
      <DropdownMenuGroup>
        {/* TODO: Вынести права в константы */}
        {AccessRole[accessRole] >= AccessRole.ADMIN && (
          <DropdownMenuItem onSelect={onEditBoardName}>
            <PencilLine />
            {t("rename.action")}
          </DropdownMenuItem>
        )}

        {AccessRole[accessRole] >= AccessRole.OWNER && (
          <DropdownMenuItem onSelect={onEditBoardAccess}>
            <Share2 />
            {t("access.action")}
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>

      {AccessRole[accessRole] >= AccessRole.OWNER && (
        <>
          <Separator className="my-1" />

          <DropdownMenuItem onSelect={onDeleteBoard} variant="destructive">
            <Trash2 />
            {t("delete.action")}
          </DropdownMenuItem>
        </>
      )}
    </>
  );
}
