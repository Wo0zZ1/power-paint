import { redirect } from "next/navigation";

import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";

import { WorkspacesCarouselBlock } from "@/widgets/workspaces-carousel";
import { BoardsCarouselBlock } from "@/widgets/boards-carousel";

export async function DashboardPage() {
  const session = await getSession();

  if (!session) redirect(ROUTES.LOGIN);

  return (
    <div>
      <WorkspacesCarouselBlock />

      <BoardsCarouselBlock />
    </div>
  );
}
