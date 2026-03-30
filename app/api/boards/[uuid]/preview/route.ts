import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";
import { isTheme, THEME_PREFERENCE } from "@/shared/lib/theme";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  const { uuid } = await params;

  const board = await prisma.board.findUnique({
    where: { id: uuid },
    select: {
      name: true,
      lightPreview: true,
      darkPreview: true,
    },
  });

  if (!board) notFound();

  const url = new URL(request.url);
  const themeParam = url.searchParams.get("theme");
  const theme =
    isTheme(themeParam) && themeParam !== "system"
      ? themeParam
      : THEME_PREFERENCE;

  const dataUrl =
    theme === "dark"
      ? (board.darkPreview ?? board.lightPreview)
      : (board.lightPreview ?? board.darkPreview);

  if (!dataUrl) {
    return NextResponse.json(
      {
        message: "Board preview is not available",
      },
      { status: 404 },
    );
  }

  const matcher = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);

  if (!matcher) {
    return NextResponse.json(
      {
        message: "Invalid board preview format",
      },
      { status: 500 },
    );
  }

  const [, contentType, base64Data] = matcher;
  const imageBuffer = Buffer.from(base64Data, "base64");

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
};
