import type { KonvaEventObject } from "konva/lib/Node";
import type { Node as KonvaNode } from "konva/lib/Node";
import type { Vector2d } from "konva/lib/types";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";
import { screenToCanvas } from "../lib";

const modifiedNodes = new Set<KonvaNode>();

export const resetEraserListening = () => {
  modifiedNodes.forEach((node) => node.listening(true));
  modifiedNodes.clear();
};

const interpolatePoints = (
  point1: Vector2d,
  point2: Vector2d,
  maxCount: number,
) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const dist = Math.hypot(dx, dy);

  const STEP = 5;
  const desired = Math.ceil(dist / STEP);
  const count = Math.min(maxCount, Math.max(0, desired));
  if (count <= 0) return [];

  const out: Vector2d[] = new Array(count);
  const inv = 1 / (count + 1);
  let t = inv;

  for (let i = 0; i < count; i++, t += inv)
    out[i] = { x: point1.x + dx * t, y: point1.y + dy * t };

  return out;
};

export const useEraser = () => {
  const stopListeners = useRef(() => {});
  const prefPosRef = useRef<{ x: number; y: number } | null>(null);
  const shrinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Pure core ──

  const beginErase = useCallback((clientX: number, clientY: number) => {
    const { stage, eraserLine, clearSelection, setSelectionType, viewport } =
      useBoardStore.getState();

    if (!eraserLine || !stage) return;

    clearSelection();
    setSelectionType("delete");

    const stageRect = stage.container().getBoundingClientRect();
    const x = clientX - stageRect.left;
    const y = clientY - stageRect.top;
    const [canvasX, canvasY] = screenToCanvas(x, y, viewport);

    eraserLine.points([canvasX, canvasY]);
    eraserLine.visible(true);

    prefPosRef.current = { x, y };

    if (shrinkIntervalRef.current) clearInterval(shrinkIntervalRef.current);
    shrinkIntervalRef.current = setInterval(() => {
      const pts = eraserLine.points();
      const removeCount = Math.max(1, Math.floor(pts.length / 8)) * 2;
      eraserLine.points(pts.slice(removeCount));
    }, 32); // ~30fps
  }, []);

  const moveErase = useCallback(
    (clientX: number, clientY: number, altKey: boolean) => {
      const {
        stage,
        contentLayer,
        eraserLine,
        selectMany,
        deselectMany,
        viewport,
      } = useBoardStore.getState();

      if (!stage || !contentLayer || !eraserLine || !prefPosRef.current) return;

      const stageRect = stage.container().getBoundingClientRect();
      const x = clientX - stageRect.left;
      const y = clientY - stageRect.top;

      const [canvasX, canvasY] = screenToCanvas(x, y, viewport);

      const prev = prefPosRef.current;
      prefPosRef.current = { x, y };
      const points = interpolatePoints(prev, { x, y }, 100);

      const idsToSelect = new Set<string>();
      const idsToDeselect = new Set<string>();

      for (const p of points) {
        const shape = contentLayer.getIntersection({ x: p.x, y: p.y });
        if (!shape) continue;

        const id = shape.id();
        if (altKey) idsToDeselect.add(id);
        else idsToSelect.add(id);

        shape.listening(false);
        modifiedNodes.add(shape);
      }

      if (altKey) deselectMany(idsToDeselect);
      else selectMany(idsToSelect);

      eraserLine.points(eraserLine.points().concat([canvasX, canvasY]));
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

    resetEraserListening();
    removeSelectedElements();
    clearSelection();
    setSelectionType("none");

    if (eraserLine) {
      eraserLine.visible(false);
      eraserLine.points([]);
    }
  }, []);
  const cancelErase = useCallback(() => {
    const { eraserLine, clearSelection, setSelectionType } =
      useBoardStore.getState();

    resetEraserListening();
    clearSelection();
    setSelectionType("none");

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
