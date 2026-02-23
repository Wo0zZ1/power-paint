import type { Workspace, Board } from "@prisma/client";
import type { AccessRole } from "@/shared/constants";

export type WorkspaceWithBoards = Workspace & {
  boards: Board[];
};

export interface WorkspaceWithAccess {
  workspace: WorkspaceWithBoards;
  accessRole: AccessRole;
}
