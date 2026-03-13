import type { MouseEvent } from "react";
import { useCallback, useRef } from "react";

import { useBoardStore } from "./useBoardStore";
import { screenToCanvas } from "./viewport/utils";

export const useMouseAwareness = () => {
  const rafRef = useRef<number | null>(null);

  const handleCursorMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const { viewport } = useBoardStore.getState();

      const screenX = e.nativeEvent.layerX;
      const screenY = e.nativeEvent.layerY;
      const [canvasX, canvasY] = screenToCanvas(screenX, screenY, viewport);

      useBoardStore.getState().provider?.setAwarenessField("cursor", {
        x: canvasX,
        y: canvasY,
      });
    });
  }, []);

  const handleCursorLeave = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    useBoardStore.getState().provider?.setAwarenessField("cursor", null);
  }, []);

  return { handleCursorMove, handleCursorLeave };
};
