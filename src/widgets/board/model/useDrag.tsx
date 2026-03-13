import type Konva from "konva";
import { useCallback, useRef } from "react";

import { useBoardStore } from "./useBoardStore";
import { shouldPan } from "./viewport/useViewport";

export const useDragElements = () => {
  const rafRef = useRef<number | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const onWindowMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      const elements = useBoardStore.getState().elements;
      const selectedIds = useBoardStore.getState().selectedIds;

      const scale = useBoardStore.getState().viewport.scale;
      const deltaX = (e.clientX - dragStartRef.current.x) / scale;
      const deltaY = (e.clientY - dragStartRef.current.y) / scale;

      selectedIds.forEach((id) => {
        const element = elements.get(id);
        if (!element) return;

        useBoardStore.getState().updateElement(id, {
          x: element.x + deltaX,
          y: element.y + deltaY,
        });
      });

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    });
  }, []);

  const onWindowMouseUp = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

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

  return { startDrag };
};
