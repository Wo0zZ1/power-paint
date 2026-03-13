import type { MouseEvent } from "react";
import { useCallback } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import { screenToCanvas } from "../lib/viewport";

import { useBoardStore } from "./useBoardStore";

export const useMouseAwareness = () => {
  const handleCursorMove = useThrottledCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const { viewport } = useBoardStore.getState();

      const screenX = e.nativeEvent.layerX;
      const screenY = e.nativeEvent.layerY;
      const [canvasX, canvasY] = screenToCanvas(screenX, screenY, viewport);

      useBoardStore.getState().provider?.setAwarenessField("cursor", {
        x: canvasX,
        y: canvasY,
      });
    },
    [],
  );

  const handleCursorLeave = useCallback(() => {
    useBoardStore.getState().provider?.setAwarenessField("cursor", null);
  }, []);

  return { handleCursorMove, handleCursorLeave };
};
