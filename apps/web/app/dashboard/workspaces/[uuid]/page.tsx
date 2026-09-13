import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";

import type { WorkspaceWithAccess } from "@/entities/workspace";
import { getWorkspaceQueryOption } from "@/entities/workspace/server";

import { BoardsCarouselBlock } from "@/widgets/boards-carousel";

export default async function Workspace({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const [{ uuid }, t, cookieStore] = await Promise.all([
    params,
    getTranslations("board"),
    cookies(),
  ]);

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
      className="mt-12"
      title={t("plural")}
      workspaceWithAccess={workspaceWithAccess}
      action={
        <Button variant="link" size="xs" className="text-sm" asChild>
          <Link
            href={ROUTES.DASHBOARD.BOARDS(workspaceWithAccess.workspace.id)}
          >
            {t("all")}
          </Link>
        </Button>
      }
    />
  );
}
