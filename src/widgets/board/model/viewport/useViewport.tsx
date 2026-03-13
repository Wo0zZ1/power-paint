import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useRef } from "react";

import { useBoardStore } from "../useBoardStore";

import { zoomTowardsMouse } from "./utils";

/**
 * Определяет, должен ли текущий mousedown начать pan.
 */
export function shouldPan(button: number): boolean {
  const { tool, modifiers } = useBoardStore.getState();

  if (button === 1) return true;
  if (tool === "hand") return true;
  if (modifiers.space && button === 0) return true;

  return false;
}

export const useViewport = () => {
  const rafRef = useRef<number | null>(null);
  const panStartRef = useRef({ x: 0, y: 0 });

  const handleZoom = useCallback((e: KonvaEventObject<WheelEvent>) => {
    const scaleBy = e.evt.deltaY < 0 ? 1.1 : 0.9;
    const viewport = useBoardStore.getState().viewport;

    const newViewport = zoomTowardsMouse(
      e.evt.clientX,
      e.evt.clientY,
      viewport,
      scaleBy,
    );

    useBoardStore.getState().updateViewport(newViewport);
  }, []);

  const applyPan = useCallback((x: number, y: number) => {
    const deltaX = x - panStartRef.current.x;
    const deltaY = y - panStartRef.current.y;

    const viewport = useBoardStore.getState().viewport;
    useBoardStore.getState().updateViewport({
      x: viewport.x + deltaX,
      y: viewport.y + deltaY,
    });

    panStartRef.current = { x, y };
  }, []);

  const onWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() =>
        applyPan(e.clientX, e.clientY),
      );
    },
    [applyPan],
  );

  const onWindowMouseUp = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    window.removeEventListener("mousemove", onWindowMouseMove);
  }, [onWindowMouseMove]);

  const startPan = useCallback(
    (screenX: number, screenY: number) => {
      panStartRef.current = { x: screenX, y: screenY };

      window.addEventListener("mousemove", onWindowMouseMove);
      window.addEventListener("mouseup", onWindowMouseUp);
    },
    [onWindowMouseMove, onWindowMouseUp],
  );

  return {
    handleZoom,
    startPan,
  };
};
