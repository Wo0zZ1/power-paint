import { redirect } from "next/navigation";

import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";

import { WorkspacesGridBlock } from "@/widgets/workspaces-grid";

export async function WorkspacesPage() {
  const session = await getSession();

  if (!session) redirect(ROUTES.LOGIN);

  return <WorkspacesGridBlock />;
}
