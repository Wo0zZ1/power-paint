import type { Workspace } from "@prisma/client";
import { MemberRole } from "@prisma/client";
import { z } from "zod";

import { accessLevelSchema } from "@/shared/lib/schemas";

const boardNameSchema = z
  .string()
  .min(3, "board.errors.name_too_short")
  .max(25, "board.errors.name_too_long");

const getWorkspaceIdSchema = (workspaceIds: Workspace["id"][]) => {
  const validWorkspaceIds = new Set(workspaceIds);

  return z
    .uuid("workspace.errors.invalid_id")
    .refine(
      (id) => validWorkspaceIds.size === 0 || validWorkspaceIds.has(id),
      "workspace.errors.not_found_or_no_access",
    );
};

const boardMemberSchema = z.object({
  userId: z.uuid(),
  role: z.enum(MemberRole, {
    error: "board.errors.invalid_member_role",
  }),
});

// Exported Schemas

export const getCreateBoardFormSchema = (workspaceIds: Workspace["id"][]) => {
  return z.object({
    name: boardNameSchema,
    workspaceId: getWorkspaceIdSchema(workspaceIds),
  });
};

export type CreateBoardFormData = z.infer<
  ReturnType<typeof getCreateBoardFormSchema>
>;

export const createBoardSchema = getCreateBoardFormSchema([]).and(
  z.object({
    accessLevel: accessLevelSchema.optional(),
  }),
);

export type CreateBoardData = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = z.object({
  ownerId: z.uuid().optional(),
  name: boardNameSchema.optional(),
  accessLevel: accessLevelSchema.optional(),
  members: z.array(boardMemberSchema).optional(),
});

export type UpdateBoardData = z.infer<typeof updateBoardSchema>;
