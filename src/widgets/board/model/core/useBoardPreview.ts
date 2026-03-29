"use client";

import type { Layer } from "konva/lib/Layer";
import type { RefObject } from "react";
import { useEffect } from "react";

import { getSystemTheme, useTheme } from "@/shared/lib/theme";

import { updateBoardPreviewAction } from "../actions";
import { generateBothPreviews } from "../lib";

interface UseBoardPreviewProps {
  ref: RefObject<Layer | null>;
  boardId: string;
}

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

      await updateBoardPreviewAction(boardId, lightPreview, "light");
      await updateBoardPreviewAction(boardId, darkPreview, "dark");
    };

    const intervalId = setInterval(sendPreview, 5 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [ref, boardId, themePreference]);
};
