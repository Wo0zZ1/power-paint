import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import { generateId } from "../lib/utils";
import { screenToCanvas } from "../lib/viewport";

import { createCircle } from "./types";
import { useBoardStore } from "./useBoardStore";
import { DEFAULT_CAPTURE_TIMEOUT } from "./useHocuspocus";

export const useCircleDrawing = () => {
  const shapeIdRef = useRef<string | null>(null);
  const originRef = useRef({ x: 0, y: 0 });

  const stopListeners = useRef(() => {});

  const beginDraw = useCallback((layerX: number, layerY: number) => {
    const { viewport, undoManager } = useBoardStore.getState();

    if (undoManager) {
      undoManager.stopCapturing();
      undoManager.captureTimeout = Number.MAX_SAFE_INTEGER;
    }

    const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

    const id = generateId();
    shapeIdRef.current = id;
    originRef.current = { x: cx, y: cy };

    const shape = createCircle({ id, x: cx, y: cy, radius: 0 });

    useBoardStore.getState().addElement(shape);
  }, []);

  const moveDraw = useCallback(
    (layerX: number, layerY: number, shiftKey: boolean) => {
      if (!shapeIdRef.current) return;

      const viewport = useBoardStore.getState().viewport;
      const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

      const origin = originRef.current;

      let radiusX = Math.abs(cx - origin.x) / 2;
      let radiusY = Math.abs(cy - origin.y) / 2;

      const radius = Math.max(radiusX, radiusY);

      if (shiftKey) {
        radiusX = radius;
        radiusY = radius;
      }

      const scaleX = shiftKey ? 1 : radiusX / radius;
      const scaleY = shiftKey ? 1 : radiusY / radius;

      const minX = Math.min(cx, origin.x);
      const minY = Math.min(cy, origin.y);

      useBoardStore.getState().updateElement(shapeIdRef.current, {
        x: minX + radiusX,
        y: minY + radiusY,
        scaleX,
        scaleY,
        radius,
      });
    },
    [],
  );

  const endDraw = useCallback(() => {
    if (!shapeIdRef.current) return;

    const { undoManager, setTool, pureSelect } = useBoardStore.getState();
    const currentId = shapeIdRef.current;
    shapeIdRef.current = null;

    if (undoManager) {
      undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
      undoManager.stopCapturing();
    }

    pureSelect(currentId);
    setTool("select");
  }, []);

  const cancelDraw = useCallback(() => {
    if (!shapeIdRef.current) return;

    useBoardStore.getState().removeElement(shapeIdRef.current);
    shapeIdRef.current = null;

    const { undoManager } = useBoardStore.getState();
    if (undoManager) {
      undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
      undoManager.stopCapturing();
    }
  }, []);

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    moveDraw(e.layerX, e.layerY, e.shiftKey);
  });

  const onPointerUp = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startPointerCircleDraw = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      beginDraw(e.evt.layerX, e.evt.layerY);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [beginDraw, onPointerMove, onPointerUp],
  );

  const containerRectRef = useRef<DOMRect | null>(null);

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
      e.shiftKey,
    );
  });

  const onTouchDrawEnd = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startTouchCircleDraw = useCallback(
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
      if (shapeIdRef.current) {
        const { undoManager } = useBoardStore.getState();
        if (undoManager) {
          undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
          undoManager.stopCapturing();
        }
      }
    };
  }, []);

  return {
    startPointerCircleDraw,
    startTouchCircleDraw,
  };
};
