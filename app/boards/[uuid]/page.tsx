import type { Metadata } from "next";

import { ROUTES } from "@/shared/config";
import { prisma } from "@/shared/lib/prisma";
import { Board } from "@/widgets/board";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const ORIGIN = process.env.NEXT_PUBLIC_BASE_URL as string;

  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
    select: {
      name: true,
      lightPreview: true,
      darkPreview: true,
    },
  });

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
    title: board.name,
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
