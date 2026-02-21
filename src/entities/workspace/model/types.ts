import type { Workspace } from "@prisma/client";
import type { AccessRole } from "@/shared/constants";

export interface WorkspaceWithAccess {
  workspace: Workspace;
  accessRole: AccessRole;
}
