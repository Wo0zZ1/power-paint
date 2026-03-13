import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import type { BoardWithAccess } from "@/entities/board";
import { getBoardQueryOption } from "@/entities/board/server";
import { getQueryClient } from "@/shared/api";

export default async function BoardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  let boardWithAccess: BoardWithAccess;

  try {
    boardWithAccess = await queryClient.fetchQuery(
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
      <div className="container mx-auto mt-8">
        <h2 className="text-4xl font-bold">{boardWithAccess.board.name}</h2>
      </div>

      {children}
    </HydrationBoundary>
  );
}
