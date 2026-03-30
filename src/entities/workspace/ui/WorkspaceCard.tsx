import preview1 from "@/public/assets/preview1.jpeg"; // TODO Remove this hardcoded preview image
import type { AccessRole } from "@/shared/constants";
import { Card } from "@/shared/ui";
import { cn } from "@/utils";

import type { Workspace, WorkspaceWithAccess } from "../model/types";

import { WorkspaceCardBadge } from "./WorkspaceCardBadge";
import { WorkspaceCardFooter } from "./WorkspaceCardFooter";
import { WorkspaceCardHeader } from "./WorkspaceCardHeader";
import { WorkspaceCardImage } from "./WorkspaceCardImage";
import { WorkspaceCardSettingsMenu } from "./WorkspaceCardSettingsMenu";

interface WorkspaceCardProps {
  workspace: Workspace;
  accessRole: AccessRole;
  buttonText: string;
  onEditWorkspaceName?: (workspace: WorkspaceWithAccess) => void;
  onEditWorkspaceAccess?: (workspace: WorkspaceWithAccess) => void;
  onDeleteWorkspace?: (workspace: WorkspaceWithAccess) => void;
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
    <div className="p-0.5">
      <Card
        className={cn(
          "select-text relative h-full overflow-hidden pt-0",
          className,
        )}
      >
        <WorkspaceCardBadge accessRole={accessRole} />

        <WorkspaceCardSettingsMenu
          accessRole={accessRole}
          onEditWorkspaceName={(accessRole) =>
            onEditWorkspaceName?.({ workspace, accessRole })
          }
          onEditWorkspaceAccess={(accessRole) =>
            onEditWorkspaceAccess?.({ workspace, accessRole })
          }
          onDeleteWorkspace={(accessRole) =>
            onDeleteWorkspace?.({ workspace, accessRole })
          }
        />

        <WorkspaceCardImage workspaceId={workspace.id} imageProps={preview1} />

        <WorkspaceCardHeader className="grow" name={workspace.name} />

        <WorkspaceCardFooter
          buttonText={buttonText}
          workspaceId={workspace.id}
        />
      </Card>
    </div>
  );
}
