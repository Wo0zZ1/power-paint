"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";

import { AccessRole } from "@/shared/constants";

import {
  DropdownMenuContent,
  DropdownMenuLabel,
  Separator,
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
} from "@/shared/ui";

import { WorkspaceCardMenuActions } from "./WorkspaceCardMenuActions";

interface WorkspaceCardSettingsMenuProps {
  accessRole: AccessRole;
  onEditWorkspaceName?: () => void;
  onEditWorkspaceAccess?: () => void;
  onDeleteWorkspace?: () => void;
}

export function WorkspaceCardSettingsMenu({
  accessRole,
  onEditWorkspaceName,
  onEditWorkspaceAccess,
  onDeleteWorkspace,
}: WorkspaceCardSettingsMenuProps) {
  const t = useTranslations("workspace");

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

        <WorkspaceCardMenuActions
          accessRole={accessRole}
          onEditWorkspaceName={onEditWorkspaceName}
          onEditWorkspaceAccess={onEditWorkspaceAccess}
          onDeleteWorkspace={onDeleteWorkspace}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
