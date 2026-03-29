"use server";

import z from "zod";

import { prisma } from "@/shared/lib/prisma";

const base64ImageSchema = z
  .string()
  .regex(
    /^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/]+={0,2}$/,
    "Invalid data URL for preview image",
  );

export async function updateBoardPreviewAction(
  boardId: string,
  previewDataUrl: string,
) {
  base64ImageSchema.parse(previewDataUrl);

  await prisma.board.update({
    where: { id: boardId },
    data: {
      preview: previewDataUrl,
    },
  });

  return { success: true };
}
