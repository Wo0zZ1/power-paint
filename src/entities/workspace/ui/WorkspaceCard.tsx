import type { Workspace } from "@prisma/client";

import { AccessRole } from "@/shared/constants";
import { Card } from "@/shared/ui";
import { cn } from "@/utils";


import preview1 from "../../../../public/assets/preview1.jpeg"; // TODO Remove this hardcoded preview image

import { WorkspaceCardBadge } from "./WorkspaceCardBadge";
import { WorkspaceCardFooter } from "./WorkspaceCardFooter";
import { WorkspaceCardHeader } from "./WorkspaceCardHeader";
import { WorkspaceCardImage } from "./WorkspaceCardImage";
import { WorkspaceCardSettingsMenu } from "./WorkspaceCardSettingsMenu";


interface WorkspaceCardProps {
  workspace: Workspace;
  accessRole: AccessRole;
  buttonText: string;
  onEditWorkspaceName?: (workspace: Workspace) => void;
  onEditWorkspaceAccess?: (workspace: Workspace) => void;
  onDeleteWorkspace?: (workspace: Workspace) => void;
  className?: string;
}

export function WorkspaceCard({
  workspace,
  accessRole,
  buttonText,
  onEditWorkspaceName,
  onEditWorkspaceAccess,
  onDeleteWorkspace,
  className,
}: WorkspaceCardProps) {
  return (
    <Card
      className={cn("select-text relative h-full overflow-hidden", className)}
    >
      <WorkspaceCardBadge accessRole={accessRole} />

      {AccessRole[accessRole] >= AccessRole.ADMIN && (
        <WorkspaceCardSettingsMenu
          accessRole={accessRole}
          onEditWorkspaceName={() => onEditWorkspaceName?.(workspace)}
          onEditWorkspaceAccess={() => onEditWorkspaceAccess?.(workspace)}
          onDeleteWorkspace={() => onDeleteWorkspace?.(workspace)}
        />
      )}

      <WorkspaceCardImage workspaceId={workspace.id} imageProps={preview1} />

      <WorkspaceCardHeader name={workspace.name} />

      <WorkspaceCardFooter buttonText={buttonText} workspaceId={workspace.id} />
    </Card>
  );
}
