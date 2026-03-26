import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspaceQueryOption } from "@/entities/workspace/server";
import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";
import { BoardsCarouselBlock } from "@/widgets/boards-carousel";

export default async function Workspace({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const t = await getTranslations();

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  let workspaceWithAccess: WorkspaceWithAccess;

  try {
    workspaceWithAccess = await queryClient.fetchQuery(
      getWorkspaceQueryOption({
        workspaceId: uuid,
        cookieString: cookieStore.toString(),
      }),
    );
  } catch {
    notFound();
  }

  return (
    <BoardsCarouselBlock
      title={t("board.plural")}
      workspaceWithAccess={workspaceWithAccess}
      action={
        <Button variant="link" size="xs" className="text-sm" asChild>
          <Link
            href={ROUTES.DASHBOARD.BOARDS(workspaceWithAccess.workspace.id)}
          >
            {t("board.all")}
          </Link>
        </Button>
      }
    />
  );
}
