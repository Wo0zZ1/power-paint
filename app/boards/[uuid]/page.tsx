export default async function Boards({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  return <BoardsPage />;
}
