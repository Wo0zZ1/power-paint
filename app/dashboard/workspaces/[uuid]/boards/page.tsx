import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

import { getQueryClient } from "@/shared/api";
import { GoBackButton } from "@/shared/ui";

import { getWorkspaceQueryOption } from "@/entities/workspace/server";

import { BoardsGridBlock } from "@/widgets/boards-grid";

export default async function BoardsPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const t = await getTranslations();
  const { uuid } = await params;

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  const workspaceWithAccess = await queryClient.fetchQuery(
    getWorkspaceQueryOption({
      workspaceId: uuid,
      cookieString: cookieStore.toString(),
    }),
  );

  return (
    <BoardsGridBlock
      className="mt-12"
      title={t("board.all")}
      workspaceWithAccess={workspaceWithAccess}
      action={<GoBackButton variant="link" size="xs" className="text-sm" />}
    />
  );
}
