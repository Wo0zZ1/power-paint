import type { Workspace } from "@prisma/client";
import type { AccessRole } from "@/shared/lib/auth";

export interface WorkspaceWithAccess {
  workspace: Workspace;
  accessRole: AccessRole;
}
