import { Workspace } from "@prisma/client";

import { cn } from "@/utils";
import { AccessRole } from "@/shared/constants";

import { Card } from "@/shared/ui";

import { WorkspaceCardBadge } from "./WorkspaceCardBadge";
import { WorkspaceCardImage } from "./WorkspaceCardImage";
import { WorkspaceCardHeader } from "./WorkspaceCardHeader";
import { WorkspaceCardFooter } from "./WorkspaceCardFooter";
import { WorkspaceCardSettingsMenu } from "./WorkspaceCardSettingsMenu";

import preview1 from "../../../../public/assets/preview1.jpeg"; // TODO Remove this hardcoded preview image

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
      <WorkspaceCardBadge type={workspace.accessLevel} />

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
