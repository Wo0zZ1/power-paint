import { AccessLevel, MemberRole } from "@prisma/client";
import { z } from "zod";

const workspaceNameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(25, "Name must be less than 25 characters long");

const workspaceAccessLevelSchema = z.enum(AccessLevel, {
  error: "Invalid access level",
});

export const workspaceMemberSchema = z.object({
  userId: z.uuid(),
  role: z.enum(MemberRole, {
    error: "Invalid member role",
  }),
});

export const createWorkspaceFormSchema = z.object({
  name: workspaceNameSchema,
});

export type CreateWorkspaceFormData = z.infer<typeof createWorkspaceFormSchema>;

export const createWorkspaceSchema = createWorkspaceFormSchema.and(
  z.object({
    accessLevel: workspaceAccessLevelSchema.optional(),
  }),
);

export type CreateWorkspaceData = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  ownerId: z.uuid().optional(),
  name: workspaceNameSchema.optional(),
  accessLevel: workspaceAccessLevelSchema.optional(),
  members: z.array(workspaceMemberSchema).optional(),
});

export type UpdateWorkspaceData = z.infer<typeof updateWorkspaceSchema>;
