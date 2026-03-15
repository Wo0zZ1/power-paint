import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import { generateId } from "../lib/utils";
import { screenToCanvas } from "../lib/viewport";

import { createStroke, type StrokeElementType } from "./types";
import { useBoardStore } from "./useBoardStore";
import { DEFAULT_CAPTURE_TIMEOUT } from "./useHocuspocus";

export const useDrawing = () => {
  const strokeIdRef = useRef<string | null>(null);
  const originRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef<number[]>([]);

  const stopListeners = useRef(() => {});

  // ── Pure core ──

  const beginDraw = useCallback((layerX: number, layerY: number) => {
    const { viewport, undoManager } = useBoardStore.getState();

    if (undoManager) {
      undoManager.stopCapturing();
      undoManager.captureTimeout = Number.MAX_SAFE_INTEGER;
    }

    const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

    const id = generateId();
    strokeIdRef.current = id;
    originRef.current = { x: cx, y: cy };
    pointsRef.current = [0, 0];

    const stroke = createStroke({ x: cx, y: cy, points: [0, 0], id });

    useBoardStore.getState().addElement(stroke);
  }, []);

  const moveDraw = useCallback((layerX: number, layerY: number) => {
    if (!strokeIdRef.current) return;

    const viewport = useBoardStore.getState().viewport;
    const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

    pointsRef.current.push(cx - originRef.current.x, cy - originRef.current.y);

    useBoardStore.getState().updateElement(strokeIdRef.current, {
      points: [...pointsRef.current],
    } as Partial<StrokeElementType>);
  }, []);

  const endDraw = useCallback(() => {
    if (!strokeIdRef.current) return;

    const { undoManager } = useBoardStore.getState();
    const points = pointsRef.current;

    if (points.length < 4) {
      useBoardStore.getState().removeElement(strokeIdRef.current);
      strokeIdRef.current = null;
      if (undoManager) {
        undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
        undoManager.stopCapturing();
      }
      return;
    }

    const xs = points.filter((_, i) => i % 2 === 0);
    const ys = points.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);

    const normalizedPoints = points.map((v, i) =>
      i % 2 === 0 ? v - minX : v - minY,
    );

    useBoardStore.getState().updateElement(strokeIdRef.current, {
      x: originRef.current.x + minX,
      y: originRef.current.y + minY,
      points: normalizedPoints,
    } as Partial<StrokeElementType>);

    strokeIdRef.current = null;

    if (undoManager) {
      undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
      undoManager.stopCapturing();
    }
  }, []);

  const cancelDraw = useCallback(() => {
    if (!strokeIdRef.current) return;

    useBoardStore.getState().removeElement(strokeIdRef.current);
    strokeIdRef.current = null;

    const { undoManager } = useBoardStore.getState();
    if (undoManager) {
      undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
      undoManager.stopCapturing();
    }
  }, []);

  // ── Pointer ──

  const containerRectRef = useRef<DOMRect | null>(null);

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    if (!containerRectRef.current) return;
    moveDraw(
      e.clientX - containerRectRef.current.left,
      e.clientY - containerRectRef.current.top
    );
  });

  const onPointerUp = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startPointerDraw = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      const stage = e.target.getStage();
      if (!stage) return;

      const rect = stage.container().getBoundingClientRect();
      containerRectRef.current = rect;

      beginDraw(e.evt.clientX - rect.left, e.evt.clientY - rect.top);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [beginDraw, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const onTouchDrawMove = useThrottledCallback((e: TouchEvent) => {
    if (e.touches.length >= 2) {
      cancelDraw();
      stopListeners.current();
      return;
    }
    const touch = e.touches[0];
    if (!touch || !containerRectRef.current) return;
    moveDraw(
      touch.clientX - containerRectRef.current.left,
      touch.clientY - containerRectRef.current.top,
    );
  });

  const onTouchDrawEnd = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startTouchDraw = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches[0];
      if (!touch) return;
      const stage = e.target.getStage();
      if (!stage) return;
      const rect = stage.container().getBoundingClientRect();
      containerRectRef.current = rect;

      beginDraw(touch.clientX - rect.left, touch.clientY - rect.top);

      window.addEventListener("touchmove", onTouchDrawMove);
      window.addEventListener("touchend", onTouchDrawEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchDrawMove);
        window.removeEventListener("touchend", onTouchDrawEnd);
      };
    },
    [beginDraw, onTouchDrawMove, onTouchDrawEnd],
  );

  useEffect(() => {
    return () => {
      stopListeners.current();
      if (strokeIdRef.current) {
        const { undoManager } = useBoardStore.getState();
        if (undoManager) {
          undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
          undoManager.stopCapturing();
        }
      }
    };
  }, []);

  return { startPointerDraw, startTouchDraw };
};
