"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AccessRole } from "@/shared/constants";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  Separator,
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
} from "@/shared/ui";

import { BoardCardMenuActions } from "./BoardCardMenuActions";

interface BoardCardSettingsMenuProps {
  accessRole: AccessRole;
  onEditBoardName?: (role: AccessRole) => void;
  onEditBoardAccess?: (role: AccessRole) => void;
  onDeleteBoard?: (role: AccessRole) => void;
}

export function BoardCardSettingsMenu({
  accessRole,
  onEditBoardName,
  onEditBoardAccess,
  onDeleteBoard,
}: BoardCardSettingsMenuProps) {
  const t = useTranslations("board");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant="secondary"
          className="absolute z-10 top-4 right-4"
        >
          <Settings />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>

        <Separator className="my-1" />

        <BoardCardMenuActions
          accessRole={accessRole}
          onEditBoardName={() => onEditBoardName?.(accessRole)}
          onEditBoardAccess={() => onEditBoardAccess?.(accessRole)}
          onDeleteBoard={() => onDeleteBoard?.(accessRole)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
