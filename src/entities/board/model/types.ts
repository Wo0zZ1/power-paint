import type { Board as PrismaBoard, BoardMember } from "@prisma/client";

import type { AccessRole } from "@/shared/constants";
import type { PublicUser } from "@/shared/types";

export type BoardMemberWithUser = BoardMember & {
  user: PublicUser;
};

export type Board = PrismaBoard & {
  members: BoardMemberWithUser[];
};

export interface BoardWithAccess {
  board: Board;
  accessRole: AccessRole;
}
