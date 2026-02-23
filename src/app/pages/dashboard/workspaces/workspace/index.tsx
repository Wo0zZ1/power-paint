import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";

import { getQueryClient } from "@/shared/api";
import { ROUTES } from "@/shared/config";

import { getWorkspaceQueryOption } from "@/entities/workspace/server";

import { BoardsGridBlock } from "@/widgets/boards-grid";

interface WorkspacePageProps {
  uuid: string;
}

export async function WorkspacePage({ uuid }: WorkspacePageProps) {
  const t = await getTranslations();

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  const workspace = await queryClient.fetchQuery(
    getWorkspaceQueryOption({
      workspaceId: uuid,
      cookieString: cookieStore.toString(),
    }),
  );

  return (
    <div>
      <BoardsGridBlock
        title={workspace.workspace.name}
        workspace={workspace}
        link={
          <Link scroll={false} href={ROUTES.DASHBOARD.ROOT}>
            {t("goBack")}
          </Link>
        }
      />
    </div>
  );
}
