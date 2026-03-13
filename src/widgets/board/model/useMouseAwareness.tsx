import type { MouseEvent } from "react";
import { useCallback } from "react";

import { useBoardStore } from "./useBoardStore";
import { screenToCanvas } from "./viewport/utils";

export const useMouseAwareness = () => {
  const handleCursorMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const { viewport } = useBoardStore.getState();

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const [canvasX, canvasY] = screenToCanvas(screenX, screenY, viewport);

    useBoardStore.getState().provider?.setAwarenessField("cursor", {
      x: canvasX,
      y: canvasY,
    });
  }, []);

  const handleCursorLeave = useCallback(() => {
    useBoardStore.getState().provider?.setAwarenessField("cursor", null);
  }, []);

  return { handleCursorMove, handleCursorLeave };
};
