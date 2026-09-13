import type {
  Workspace as PrismaWorkspace,
  WorkspaceMember,
} from "@prisma/client";

import type { AccessRole } from "@/shared/constants";
import type { Board, PublicUser } from "@/shared/types";

export type WorkspaceMemberWithUser = WorkspaceMember & {
  user: PublicUser;
};

export type Workspace = PrismaWorkspace & {
  boards: Board[];
  members: WorkspaceMemberWithUser[];
};

export interface WorkspaceWithAccess {
  workspace: Workspace;
  accessRole: AccessRole;
}
