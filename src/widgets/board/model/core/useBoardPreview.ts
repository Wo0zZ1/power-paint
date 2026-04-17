"use client";

import { useEffect } from "react";

import { getSystemTheme, useTheme } from "@/shared/lib/theme";

import { generateBothPreviews } from "../lib";

import { useBoardStore } from "./useBoardStore";

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

interface UseBoardPreviewProps {
  boardId: string;
}

export const useBoardPreview = ({ boardId }: UseBoardPreviewProps) => {
  const { themePreference } = useTheme();

  useEffect(() => {
    const sendPreview = async () => {
      const contentLayerRef = useBoardStore.getState().contentLayer;

      if (!contentLayerRef) return;

      const resolvedTheme =
        themePreference === "system" ? getSystemTheme() : themePreference;

      const { lightPreview, darkPreview } = generateBothPreviews(
        contentLayerRef,
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
  }, [boardId, themePreference]);
};
