import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage } from "konva/lib/Stage";
import { useCallback, useEffect, useRef, type RefObject } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";
import { screenToCanvas } from "../lib";

interface UseEraserProps {
  eraserLineRef: RefObject<Konva.Line | null>;
}

export const useEraser = ({ eraserLineRef }: UseEraserProps) => {
  const stageRef = useRef<Stage | null>(null);
  const stageRectRef = useRef<DOMRect | null>(null);

  const stopListeners = useRef(() => {});
  const shrinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Pure core ──

  const beginErase = useCallback(
    (clientX: number, clientY: number, stage: Stage) => {
      if (!eraserLineRef.current) return;

      const stageRect = stage.container().getBoundingClientRect();
      stageRef.current = stage;
      stageRectRef.current = stageRect;

      const { clearSelection, setSelectionType, viewport } =
        useBoardStore.getState();

      clearSelection();
      setSelectionType("delete");

      const x = clientX - stageRect.left;
      const y = clientY - stageRect.top;
      const [canvasX, canvasY] = screenToCanvas(x, y, viewport);

      eraserLineRef.current.points([canvasX, canvasY]);
      eraserLineRef.current.visible(true);

      if (shrinkIntervalRef.current) clearInterval(shrinkIntervalRef.current);
      shrinkIntervalRef.current = setInterval(() => {
        const pts = eraserLineRef.current!.points();
        const removeCount = Math.max(1, Math.floor(pts.length / 8)) * 2;
        eraserLineRef.current!.points(pts.slice(removeCount));
      }, 32); // ~30fps
    },
    [eraserLineRef],
  );

  const moveErase = useCallback(
    (clientX: number, clientY: number, altKey: boolean) => {
      if (!stageRef.current || !eraserLineRef.current) return;

      const x = clientX - stageRectRef.current!.left;
      const y = clientY - stageRectRef.current!.top;

      const shapes = stageRef.current.getAllIntersections({ x, y });

      const selectedIds = new Set(shapes.map((shape) => shape.id()));

      const { selectMany, deselectMany, viewport } = useBoardStore.getState();

      if (altKey) deselectMany(selectedIds);
      else selectMany(selectedIds);

      const [canvasX, canvasY] = screenToCanvas(x, y, viewport);
      const currentPoints = eraserLineRef.current.points();
      eraserLineRef.current.points([...currentPoints, canvasX, canvasY]);
    },
    [eraserLineRef],
  );

  const endErase = useCallback(() => {
    const { removeSelectedElements, clearSelection, setSelectionType } =
      useBoardStore.getState();

    removeSelectedElements();
    clearSelection();
    setSelectionType("none");
    stageRef.current = null;

    if (shrinkIntervalRef.current) clearInterval(shrinkIntervalRef.current);
    if (eraserLineRef.current) {
      eraserLineRef.current.visible(false);
      eraserLineRef.current.points([]);
    }
  }, [eraserLineRef]);

  const cancelErase = useCallback(() => {
    const { clearSelection, setSelectionType } = useBoardStore.getState();

    clearSelection();
    setSelectionType("none");
    stageRef.current = null;

    if (shrinkIntervalRef.current) clearInterval(shrinkIntervalRef.current);
    if (eraserLineRef.current) {
      eraserLineRef.current.visible(false);
      eraserLineRef.current.points([]);
    }
  }, [eraserLineRef]);

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

      const stage = e.target.getStage();
      if (!stage) return;

      beginErase(e.evt.clientX, e.evt.clientY, stage);
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

      const stage = e.target.getStage();
      if (!stage) return;

      beginErase(touch.clientX, touch.clientY, stage);
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
