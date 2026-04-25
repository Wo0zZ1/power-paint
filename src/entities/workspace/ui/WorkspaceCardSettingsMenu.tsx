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

import { WorkspaceCardMenuActions } from "./WorkspaceCardMenuActions";

interface WorkspaceCardSettingsMenuProps {
  accessRole: AccessRole;
  onEditWorkspaceName?: (role: AccessRole) => void;
  onEditWorkspaceAccess?: (role: AccessRole) => void;
  onDeleteWorkspace?: (role: AccessRole) => void;
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
          title={t("settings")}
          className="absolute z-10 top-4 right-4"
        >
          <Settings />
          <span className="sr-only">{t("settings")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>

        <Separator className="my-1" />

        <WorkspaceCardMenuActions
          accessRole={accessRole}
          onEditWorkspaceName={() => onEditWorkspaceName?.(accessRole)}
          onEditWorkspaceAccess={() => onEditWorkspaceAccess?.(accessRole)}
          onDeleteWorkspace={() => onDeleteWorkspace?.(accessRole)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
