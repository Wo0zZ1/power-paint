"use client";

import type { Layer } from "konva/lib/Layer";
import type { RefObject } from "react";
import { useEffect } from "react";

import { updateBoardPreviewAction } from "../actions";
import { generateSmartPreview } from "../lib";

interface UseBoardPreviewProps {
  ref: RefObject<Layer | null>;
  boardId: string;
}

export const useBoardPreview = ({ ref, boardId }: UseBoardPreviewProps) => {
  useEffect(() => {
    const sendPreview = async () => {
      const layer = ref.current;
      if (!layer) return;

      const smartPreview = generateSmartPreview(layer);

      if (!smartPreview) return;

      await updateBoardPreviewAction(boardId, smartPreview);
    };

    const intervalId = setInterval(sendPreview, 5 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [ref, boardId]);
};
