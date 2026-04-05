import type { BoardMember, Board as PrismaBoard } from "@prisma/client";

import type { AccessRole } from "../constants";

import type { PublicUser } from ".";

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
