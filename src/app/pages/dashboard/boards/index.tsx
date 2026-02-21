import { redirect } from "next/navigation";

import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";

import { BoardsGridBlock } from "@/widgets/boards-grid";

export async function BoardsPage() {
  const session = await getSession();

  if (!session) redirect(ROUTES.LOGIN);

  return <BoardsGridBlock />;
}
