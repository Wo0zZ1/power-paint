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
  const throttledUpdate = useThrottledCallback(
    (clientX: number, clientY: number, rectLeft: number, rectTop: number) => {
      updateCursor(clientX - rectLeft, clientY - rectTop);
    },
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      throttledUpdate(e.clientX, e.clientY, rect.left, rect.top);
    },
    [throttledUpdate],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length >= 2) {
        hideCursor();
        return;
      }

      const touch = e.touches[0];
      if (!touch) return;

      const rect = e.currentTarget.getBoundingClientRect();
      throttledUpdate(touch.clientX, touch.clientY, rect.left, rect.top);
    },
    [throttledUpdate],
  );

  const handlePointerLeave = useCallback(() => {
    hideCursor();
  }, []);

  return { handleTouchMove, handlePointerMove, handlePointerLeave };
};
