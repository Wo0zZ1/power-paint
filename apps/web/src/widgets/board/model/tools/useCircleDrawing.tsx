import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";

import { DEFAULT_CAPTURE_TIMEOUT } from "@/shared/constants";
import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";
import { screenToCanvas } from "../lib";
import { createCircle } from "../types";

export const useCircleDrawing = () => {
  const shapeIdRef = useRef<string | null>(null);
  const originRef = useRef({ x: 0, y: 0 });

  const stopListeners = useRef(() => {});

  const beginDraw = useCallback((layerX: number, layerY: number) => {
    const {
      viewport,
      undoManager,
      currentStrokeColor,
      currentStrokeWidth,
      currentFillEnabled,
      currentFillColor,
    } = useBoardStore.getState();

    if (undoManager) {
      undoManager.stopCapturing();
      undoManager.captureTimeout = Number.MAX_SAFE_INTEGER;
    }

    const [cx, cy] = screenToCanvas(layerX, layerY, viewport);
    originRef.current = { x: cx, y: cy };

    const shape = createCircle({
      x: cx,
      y: cy,
      width: 0,
      height: 0,
      strokeColor: currentStrokeColor,
      strokeWidth: currentStrokeWidth,
      fillType: currentFillEnabled ? "color" : "none",
      fillColor1: currentFillColor,
      fillColor2: currentFillColor,
    });
    shapeIdRef.current = shape.id;

    useBoardStore.getState().addElement(shape);
  }, []);

  const moveDraw = useCallback(
    (layerX: number, layerY: number, shiftKey: boolean) => {
      if (!shapeIdRef.current) return;

      const viewport = useBoardStore.getState().viewport;
      const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

      const origin = originRef.current;

      let width = Math.abs(cx - origin.x);
      let height = Math.abs(cy - origin.y);

      if (shiftKey) {
        const max = Math.max(width, height);
        width = max;
        height = max;
      }

      const minX = Math.min(cx, origin.x);
      const minY = Math.min(cy, origin.y);

      useBoardStore.getState().updateElement(shapeIdRef.current, {
        x: minX,
        y: minY,
        width,
        height,
      });
    },
    [],
  );

  const endDraw = useCallback(() => {
    if (!shapeIdRef.current) return;

    const { undoManager, setTool, pureSelect, setSelectionType } =
      useBoardStore.getState();
    const currentId = shapeIdRef.current;
    shapeIdRef.current = null;

    if (undoManager) {
      undoManager.captureTimeout = DEFAULT_CAPTURE_TIMEOUT;
      undoManager.stopCapturing();
    }

    setTool("select");
    pureSelect(currentId);
    setSelectionType("transform");
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

  const containerRectRef = useRef<DOMRect | null>(null);

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    if (!containerRectRef.current) return;
    moveDraw(
      e.clientX - containerRectRef.current.left,
      e.clientY - containerRectRef.current.top,
      e.shiftKey,
    );
  });

  const onPointerUp = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startPointerCircleDraw = useCallback(
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
