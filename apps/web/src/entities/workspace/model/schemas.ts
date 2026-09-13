import { MemberRole } from "@prisma/client";
import { z } from "zod";

import { accessLevelSchema } from "@/shared/lib/schemas";

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
  members: z.array(workspaceMemberSchema).optional(),
});

export type UpdateWorkspaceData = z.infer<typeof updateWorkspaceSchema>;
