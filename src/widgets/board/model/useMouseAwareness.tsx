import type { PointerEvent, TouchEvent } from "react";
import { useCallback } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import { screenToCanvas } from "../lib/viewport";

import { useBoardStore } from "./useBoardStore";

const updateCursor = (screenX: number, screenY: number) => {
  const { viewport } = useBoardStore.getState();
  const [canvasX, canvasY] = screenToCanvas(screenX, screenY, viewport);

  useBoardStore.getState().provider?.setAwarenessField("cursor", {
    x: canvasX,
    y: canvasY,
  });
};

const hideCursor = () => {
  useBoardStore.getState().provider?.setAwarenessField("cursor", null);
};

export const useMouseAwareness = () => {
  const handleCursorMove = useThrottledCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return;
      updateCursor(e.nativeEvent.layerX, e.nativeEvent.layerY);
    },
    [],
  );

  const handleTouchCursorMove = useThrottledCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length >= 2) {
        hideCursor();
        return;
      }
      
      const touch = e.touches[0];
      if (!touch) return;

      const rect = (e.target as HTMLElement).getBoundingClientRect();

      updateCursor(touch.clientX - rect.left, touch.clientY - rect.top);
    },
    [],
  );

  const handleCursorLeave = useCallback(() => {
    hideCursor();
  }, []);

  return { handleCursorMove, handleTouchCursorMove, handleCursorLeave };
};
