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
  members: z
    .array(boardMemberSchema)
    .refine(
      (members) =>
        new Set(members.map(({ userId }) => userId)).size === members.length,
      "board.errors.duplicate_member",
    )
    .optional(),
});

export type UpdateBoardData = z.infer<typeof updateBoardSchema>;

export const MAX_BOARDS_LIMIT = 100;

// limit нужен каруселям: им хватает первых досок, остальные открываются
// на странице области.
export const boardsQuerySchema = z.object({
  userId: z.uuid().optional(),
  workspaceId: z.uuid().optional(),
  limit: z.coerce.number().int().min(1).max(MAX_BOARDS_LIMIT).optional(),
});

export type BoardsQuery = z.infer<typeof boardsQuerySchema>;

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
