import { AccessLevel, Workspace } from "@prisma/client";
import { z } from "zod";

const uuidSchema = z.uuid("Invalid workspace ID format");

export const getCreateBoardFormSchema = (workspaceIds: Workspace["id"][]) => {
  const validWorkspaceIds = new Set(workspaceIds);

  return z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(25, "Name must be less than 25 characters long"),
    workspaceId: uuidSchema.refine(
      (id) => validWorkspaceIds.size === 0 || validWorkspaceIds.has(id),
      "Selected workspace does not exist or you don't have access",
    ),
  });
};

export type CreateBoardFormData = z.infer<
  ReturnType<typeof getCreateBoardFormSchema>
>;

export const createBoardSchema = getCreateBoardFormSchema([]).and(
  z.object({
    accessLevel: z.enum(AccessLevel).optional(),
    workspaceId: uuidSchema,
    backgroundColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
      .optional(),
  }),
);

export type CreateBoardData = z.infer<typeof createBoardSchema>;
