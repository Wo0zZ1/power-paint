import type {
  BoardMember,
  Board as PrismaBoard,
  Workspace,
} from "@power-paint/db";
import { MemberRole } from "@power-paint/db";
import { z } from "zod";

import { accessLevelSchema } from "./accessLevel";
import type { AccessRole } from "./accessRole";
import type { PublicUser } from "./user";

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

export const getCreateBoardFormSchema = (workspaceIds: Workspace["id"][]) =>
  z.object({
    name: boardNameSchema,
    workspaceId: getWorkspaceIdSchema(workspaceIds),
  });

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

// Участник приходит уже обогащённым: boards берёт профили из users
// batch-запросом, связи в БД между схемами нет.
export type BoardMemberWithUser = BoardMember & {
  user: PublicUser;
};

export type Board = Omit<PrismaBoard, "lightPreview" | "darkPreview"> & {
  members: BoardMemberWithUser[];
};

export interface BoardWithAccess {
  board: Board;
  accessRole: AccessRole;
}
