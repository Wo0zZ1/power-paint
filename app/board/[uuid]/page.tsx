import { Board } from "@/widgets/board";

export default async function Boards({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return (
    <>
      <Board boardId={uuid} />
    </>
  );
}
