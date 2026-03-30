import type { Workspace } from "@prisma/client";
import { MemberRole } from "@prisma/client";
import { z } from "zod";

import { accessLevelSchema } from "@/shared/lib/schemas";

const boardNameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(25, "Name must be less than 25 characters long");

const getWorkspaceIdSchema = (workspaceIds: Workspace["id"][]) => {
  const validWorkspaceIds = new Set(workspaceIds);

  return z
    .uuid("Invalid workspace ID format")
    .refine(
      (id) => validWorkspaceIds.size === 0 || validWorkspaceIds.has(id),
      "Selected workspace does not exist or you don't have access",
    );
};

const boardMemberSchema = z.object({
  userId: z.uuid(),
  role: z.enum(MemberRole, {
    error: "Invalid member role",
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
