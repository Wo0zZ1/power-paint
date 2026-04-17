import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";
import { screenToCanvas } from "../lib";

export const useEraser = () => {
  const stopListeners = useRef(() => {});
  const shrinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Pure core ──

  const beginErase = useCallback((clientX: number, clientY: number) => {
    const { stage, eraserLine, clearSelection, setSelectionType, viewport } =
      useBoardStore.getState();

    if (!eraserLine || !stage) return;

    const stageRect = stage.container().getBoundingClientRect();

    clearSelection();
    setSelectionType("delete");

    const x = clientX - stageRect.left;
    const y = clientY - stageRect.top;
    const [canvasX, canvasY] = screenToCanvas(x, y, viewport);

    eraserLine.points([canvasX, canvasY]);
    eraserLine.visible(true);

    if (shrinkIntervalRef.current) clearInterval(shrinkIntervalRef.current);
    shrinkIntervalRef.current = setInterval(() => {
      const pts = eraserLine.points();
      const removeCount = Math.max(1, Math.floor(pts.length / 8)) * 2;
      eraserLine.points(pts.slice(removeCount));
    }, 32); // ~30fps
  }, []);

  const moveErase = useCallback(
    (clientX: number, clientY: number, altKey: boolean) => {
      const { stage, eraserLine, selectMany, deselectMany, viewport } =
        useBoardStore.getState();

      if (!stage || !eraserLine) return;

      const stageRect = stage.container().getBoundingClientRect();
      const x = clientX - stageRect.left;
      const y = clientY - stageRect.top;

      const shapes = stage.getAllIntersections({ x, y });

      const selectedIds = new Set(shapes.map((shape) => shape.id()));

      if (altKey) deselectMany(selectedIds);
      else selectMany(selectedIds);

      const [canvasX, canvasY] = screenToCanvas(x, y, viewport);
      const currentPoints = eraserLine.points();
      eraserLine.points([...currentPoints, canvasX, canvasY]);
    },
    [],
  );

  const endErase = useCallback(() => {
    const {
      eraserLine,
      removeSelectedElements,
      clearSelection,
      setSelectionType,
    } = useBoardStore.getState();

    removeSelectedElements();
    clearSelection();
    setSelectionType("none");

    if (shrinkIntervalRef.current) clearInterval(shrinkIntervalRef.current);
    if (eraserLine) {
      eraserLine.visible(false);
      eraserLine.points([]);
    }
  }, []);
  const cancelErase = useCallback(() => {
    const { eraserLine, clearSelection, setSelectionType } =
      useBoardStore.getState();

    clearSelection();
    setSelectionType("none");

    if (shrinkIntervalRef.current) clearInterval(shrinkIntervalRef.current);
    if (eraserLine) {
      eraserLine.visible(false);
      eraserLine.points([]);
    }
  }, []);

  // ── Pointer (mouse/pen — touch фильтруется) ──

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    moveErase(e.clientX, e.clientY, e.altKey);
  });

  const onPointerUp = useCallback(() => {
    endErase();
    stopListeners.current();
  }, [endErase]);

  const startPointerErase = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      beginErase(e.evt.clientX, e.evt.clientY);
      moveErase(e.evt.clientX, e.evt.clientY, e.evt.altKey);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [beginErase, moveErase, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const onTouchEraseMove = useThrottledCallback((e: TouchEvent) => {
    if (e.touches.length >= 2) {
      cancelErase();
      stopListeners.current();
      return;
    }

    const touch = e.touches[0];

    moveErase(touch.clientX, touch.clientY, e.altKey);
  });

  const onTouchEraseEnd = useCallback(() => {
    endErase();
    stopListeners.current();
  }, [endErase]);

  const startTouchErase = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      if (e.evt.cancelable) e.evt.preventDefault();

      const touch = e.evt.touches[0];
      if (!touch) return;

      beginErase(touch.clientX, touch.clientY);
      moveErase(touch.clientX, touch.clientY, e.evt.altKey);

      window.addEventListener("touchmove", onTouchEraseMove);
      window.addEventListener("touchend", onTouchEraseEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchEraseMove);
        window.removeEventListener("touchend", onTouchEraseEnd);
      };
    },
    [beginErase, moveErase, onTouchEraseMove, onTouchEraseEnd],
  );

  useEffect(() => {
    return () => stopListeners.current();
  });

  return { startPointerErase, startTouchErase };
};
