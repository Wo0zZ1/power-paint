"use client";

import type { Layer } from "konva/lib/Layer";
import type { RefObject } from "react";
import { useEffect } from "react";

import { getSystemTheme, useTheme } from "@/shared/lib/theme";

import { generateBothPreviews } from "../lib";

interface UseBoardPreviewProps {
  ref: RefObject<Layer | null>;
  boardId: string;
}

const updatePreview = async (
  boardId: string,
  previewDataUrl: string,
  theme: string,
) => {
  try {
    await fetch(`/api/boards/${boardId}/preview`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ previewDataUrl, theme }),
    });
  } catch (error) {
    console.error("Failed to update board preview", error);
  }
};

export const useBoardPreview = ({ ref, boardId }: UseBoardPreviewProps) => {
  const { themePreference } = useTheme();

  useEffect(() => {
    const sendPreview = async () => {
      const layer = ref.current;
      if (!layer) return;

      const resolvedTheme =
        themePreference === "system" ? getSystemTheme() : themePreference;

      const { lightPreview, darkPreview } = generateBothPreviews(
        layer,
        resolvedTheme,
      );

      if (!lightPreview || !darkPreview) return;

      try {
        await updatePreview(boardId, lightPreview, "light");
        await updatePreview(boardId, darkPreview, "dark");
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(sendPreview, 20 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [ref, boardId, themePreference]);
};
