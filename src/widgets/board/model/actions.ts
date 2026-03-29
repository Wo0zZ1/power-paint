"use server";

import z from "zod";

import { prisma } from "@/shared/lib/prisma";
import type { Theme } from "@/shared/lib/theme";

const base64ImageSchema = z
  .string()
  .regex(
    /^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/]+={0,2}$/,
    "Invalid data URL for preview image",
  );

export async function updateBoardPreviewAction(
  boardId: string,
  previewDataUrl: string,
  theme: Exclude<Theme, "system">,
) {
  base64ImageSchema.parse(previewDataUrl);

  if (theme === "dark") {
    await prisma.board.update({
      where: { id: boardId },
      data: { darkPreview: previewDataUrl },
    });
  } else {
    await prisma.board.update({
      where: { id: boardId },
      data: { lightPreview: previewDataUrl },
    });
  }

  return { success: true };
}
