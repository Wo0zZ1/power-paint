import { WorkspacePage } from "@/app/pages/dashboard/workspaces/workspace";

export default async function Workspace({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return <WorkspacePage uuid={uuid} />;
}
