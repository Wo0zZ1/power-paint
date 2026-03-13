import type Konva from "konva";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";

import { useBoardStore } from "./useBoardStore";
import { shouldPan } from "./useViewport";

export const useDragElements = () => {
  const dragStartRef = useRef({ x: 0, y: 0 });

  const stopListeners = useRef(() => {});

  // ── Pure core ──

  const beginDrag = useCallback((clientX: number, clientY: number) => {
    dragStartRef.current = { x: clientX, y: clientY };
  }, []);

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    const { elements, selectedIds, viewport } = useBoardStore.getState();

    const deltaX = (clientX - dragStartRef.current.x) / viewport.scale;
    const deltaY = (clientY - dragStartRef.current.y) / viewport.scale;

    const updates = new Map<string, { x: number; y: number }>();
    selectedIds.forEach((id) => {
      const element = elements.get(id);
      if (!element) return;
      updates.set(id, { x: element.x + deltaX, y: element.y + deltaY });
    });

    useBoardStore.getState().updateElements(updates);

    dragStartRef.current = { x: clientX, y: clientY };
  }, []);

  // ── Pointer (mouse/pen — touch фильтруется) ──

  const onPointerMove = useThrottledCallback(
    (e: PointerEvent) => {
      moveDrag(e.clientX, e.clientY);
    },
    [moveDrag],
  );

  const onPointerUp = useCallback(() => {
    stopListeners.current();
  }, []);

  const startPointerDrag = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;
      if (shouldPan(e.evt)) return;

      beginDrag(e.evt.clientX, e.evt.clientY);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [beginDrag, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const onTouchDragMove = useThrottledCallback(
    (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        stopListeners.current();
        return;
      }

      const touch = e.touches[0];
      if (touch) moveDrag(touch.clientX, touch.clientY);
    },
    [moveDrag],
  );

  const onTouchDragEnd = useCallback(() => {
    stopListeners.current();
  }, []);

  const startTouchDrag = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches[0];
      if (!touch) return;

      beginDrag(touch.clientX, touch.clientY);

      window.addEventListener("touchmove", onTouchDragMove);
      window.addEventListener("touchend", onTouchDragEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchDragMove);
        window.removeEventListener("touchend", onTouchDragEnd);
      };
    },
    [beginDrag, onTouchDragMove, onTouchDragEnd],
  );

  useEffect(() => {
    return () => stopListeners.current();
  }, []);

  return { startPointerDrag, startTouchDrag };
};
