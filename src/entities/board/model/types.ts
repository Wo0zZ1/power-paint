import type { Board } from "@prisma/client";

import type { AccessRole } from "@/shared/constants";

export interface BoardWithAccess {
  board: Board;
  accessRole: AccessRole;
}
