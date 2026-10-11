import type {
  Workspace as PrismaWorkspace,
  WorkspaceMember,
} from "@power-paint/db";
import { MemberRole, WorkspaceType } from "@power-paint/db";
import { z } from "zod";

import { accessLevelSchema } from "./accessLevel";
import type { AccessRole } from "./accessRole";
import type { Board } from "./board";
import type { PublicUser } from "./user";

const workspaceNameSchema = z
  .string()
  .min(3, "workspace.errors.name_too_short")
  .max(25, "workspace.errors.name_too_long");

export const workspaceMemberSchema = z.object({
  userId: z.uuid(),
  role: z.enum(MemberRole, {
    error: "workspace.errors.invalid_member_role",
  }),
});

export const createWorkspaceFormSchema = z.object({
  name: workspaceNameSchema,
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceFormSchema>;

export const createWorkspaceSchema = createWorkspaceFormSchema.and(
  z.object({
    accessLevel: accessLevelSchema.optional(),
  }),
);

export type CreateWorkspaceData = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  ownerId: z.uuid().optional(),
  name: workspaceNameSchema.optional(),
  accessLevel: accessLevelSchema.optional(),
  members: z
    .array(workspaceMemberSchema)
    .refine(
      (members) =>
        new Set(members.map(({ userId }) => userId)).size === members.length,
      "workspace.errors.duplicate_member",
    )
    .optional(),
});

export type UpdateWorkspaceData = z.infer<typeof updateWorkspaceSchema>;

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

// Список областей отдаётся страницами: всех областей пользователя, включая
// чужие публичные, может быть сколько угодно. Потолок держит сервер.
export const DEFAULT_WORKSPACES_PAGE_SIZE = 24;
export const MAX_WORKSPACES_PAGE_SIZE = 100;

export const workspacesQuerySchema = z.object({
  type: z.enum(WorkspaceType).optional(),
  userId: z.uuid().optional(),
  // Только области, где можно создавать доски: владелец или администратор
  manageable: z.stringbool().optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_WORKSPACES_PAGE_SIZE)
    .default(DEFAULT_WORKSPACES_PAGE_SIZE),
  cursor: z.uuid().optional(),
});

export type WorkspacesQuery = z.infer<typeof workspacesQuerySchema>;

export interface WorkspacesPage {
  items: WorkspaceWithAccess[];
  // id последней области страницы; null - дальше ничего нет
  nextCursor: string | null;
}
