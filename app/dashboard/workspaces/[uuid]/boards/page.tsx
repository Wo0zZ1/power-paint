import { BoardsPage } from "@/app/pages/dashboard/workspaces/workspace/boards";

export default async function Boards({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return <BoardsPage uuid={uuid} />;
}
