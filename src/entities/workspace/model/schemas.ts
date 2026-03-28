import { AccessLevel, MemberRole } from "@prisma/client";
import { z } from "zod";

const workspaceName = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(25, "Name must be less than 25 characters long");

const workspaceAccessLevel = z.enum(AccessLevel, {
  error: "Invalid access level",
});

export const workspaceMember = z.object({
  userId: z.uuid(),
  role: z.enum(MemberRole, {
    error: "Invalid member role",
  }),
});

export const createWorkspaceFormSchema = z.object({
  name: workspaceName,
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceFormSchema>;

export const createWorkspaceSchema = createWorkspaceFormSchema.and(
  z.object({
    accessLevel: workspaceAccessLevel.optional(),
  }),
);

export type CreateWorkspaceData = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  ownerId: z.uuid().optional(),
  name: workspaceName.optional(),
  accessLevel: workspaceAccessLevel.optional(),
  members: z.array(workspaceMember).optional(),
});

export type UpdateWorkspaceData = z.infer<typeof updateWorkspaceSchema>;
