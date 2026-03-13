import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getBoardQueryOption } from "@/entities/board/server";
import { getQueryClient } from "@/shared/api";
import { Board } from "@/widgets/board";

export default async function Boards({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery(
      getBoardQueryOption({
        boardId: uuid,
        cookieString: cookieStore.toString(),
      }),
    );
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Board boardId={uuid} />
    </HydrationBoundary>
  );
}
