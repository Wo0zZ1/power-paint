import type { Metadata } from "next";
import { headers } from "next/headers";

import { ROUTES } from "@/shared/config";

import { fetchBoardMeta } from "@/entities/board/server";

import { Board } from "@/widgets/board";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const ORIGIN = process.env.NEXT_PUBLIC_BASE_URL as string;

  const [{ uuid }, headerStore] = await Promise.all([params, headers()]);

  const board = await fetchBoardMeta({
    boardId: uuid,
    forwardedFor: headerStore.get("x-forwarded-for"),
  }).catch(() => null);

  if (!board) {
    return {
      title: "Board not found",
      openGraph: {
        title: "Board not found",
      },
    };
  }

  const previewLightUrl = `${ORIGIN}/api/boards/${uuid}/preview?theme=light`;
  const previewDarkUrl = `${ORIGIN}/api/boards/${uuid}/preview?theme=dark`;

  return {
    title: `${board.name} - Board`,
    description: `Просмотр доски ${board.name}`,
    openGraph: {
      title: board.name,
      description: `Board ${board.name}`,
      url: `${ORIGIN}${ROUTES.BOARD(uuid)}`,
      images: [
        {
          url: previewLightUrl,
          alt: `${board.name} preview (light)`,
        },
        {
          url: previewDarkUrl,
          alt: `${board.name} preview (dark)`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: board.name,
      description: `Board ${board.name}`,
      images: [previewLightUrl],
    },
  } as Metadata;
}

export default async function Boards({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  return <Board boardId={uuid} />;
}
