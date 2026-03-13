import type Konva from "konva";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";

import { useBoardStore } from "./useBoardStore";
import { shouldPan } from "./useViewport";

export const useDragElements = () => {
  const dragStartRef = useRef({ x: 0, y: 0 });

  const onWindowMouseMove = useThrottledCallback((e: MouseEvent) => {
    const elements = useBoardStore.getState().elements;
    const selectedIds = useBoardStore.getState().selectedIds;

    const scale = useBoardStore.getState().viewport.scale;
    const deltaX = (e.clientX - dragStartRef.current.x) / scale;
    const deltaY = (e.clientY - dragStartRef.current.y) / scale;

    const updates = new Map<string, { x: number; y: number }>();
    selectedIds.forEach((id) => {
      const element = elements.get(id);
      if (!element) return;
      updates.set(id, { x: element.x + deltaX, y: element.y + deltaY });
    });

    useBoardStore.getState().updateElements(updates);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onWindowMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", onWindowMouseMove);
  }, [onWindowMouseMove]);

  const startDrag = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (shouldPan(e.evt.button)) return;

      dragStartRef.current = { x: e.evt.clientX, y: e.evt.clientY };

      window.addEventListener("mousemove", onWindowMouseMove);
      window.addEventListener("mouseup", onWindowMouseUp);
    },
    [onWindowMouseMove, onWindowMouseUp],
  );

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("mouseup", onWindowMouseUp);
    };
  }, [onWindowMouseMove, onWindowMouseUp]);

  return { startDrag };
};
