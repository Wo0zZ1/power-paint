import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import { generateId } from "../lib/utils";
import { screenToCanvas } from "../lib/viewport";

import { createCircle, createRect } from "./types";
import { useBoardStore } from "./useBoardStore";
import { DEFAULT_CAPTURE_TIMEOUT } from "./useHocuspocus";

export const useShapeDrawing = () => {
  const shapeIdRef = useRef<string | null>(null);
  const originRef = useRef({ x: 0, y: 0 });
  const typeRef = useRef<"rect" | "circle">("rect");

  const stopListeners = useRef(() => {});

  // ── Pure core ──

  const beginDraw = useCallback(
    (layerX: number, layerY: number, type: "rect" | "circle") => {
      const { viewport, undoManager } = useBoardStore.getState();

      if (undoManager) {
        undoManager.stopCapturing();
        undoManager.captureTimeout = Number.MAX_SAFE_INTEGER;
      }

      const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

      const id = generateId();
      shapeIdRef.current = id;
      originRef.current = { x: cx, y: cy };
      typeRef.current = type;

      const shape =
        type === "rect"
          ? createRect({ id, x: cx, y: cy, width: 0, height: 0 })
          : createCircle({ id, x: cx, y: cy, radius: 0 });

      useBoardStore.getState().addElement(shape);
    },
    [],
  );

  const moveDraw = useCallback((layerX: number, layerY: number) => {
    if (!shapeIdRef.current) return;

    const viewport = useBoardStore.getState().viewport;
    const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

    const origin = originRef.current;

    if (typeRef.current === "rect") {
      const minX = Math.min(cx, origin.x);
      const minY = Math.min(cy, origin.y);
      const width = Math.abs(cx - origin.x);
      const height = Math.abs(cy - origin.y);

      useBoardStore.getState().updateElement(shapeIdRef.current, {
        x: minX,
        y: minY,
        width,
        height,
      });
    } else if (typeRef.current === "circle") {
      const radiusX = Math.abs(cx - origin.x) / 2;
      const radiusY = Math.abs(cy - origin.y) / 2;
      const radius = Math.max(radiusX, radiusY);

      const minX = Math.min(cx, origin.x);
      const minY = Math.min(cy, origin.y);

      useBoardStore.getState().updateElement(shapeIdRef.current, {
        x: minX + radiusX,
        y: minY + radiusY,
        radius,
      });
    }
  }, []);

  const endDraw = useCallback(() => {
    if (!shapeIdRef.current) return;

    const shape = useBoardStore.getState().elements.get(shapeIdRef.current);
    if (shape) {
      if (shape.type === "rect" && (shape.width < 5 || shape.height < 5)) {
        useBoardStore.getState().updateElement(shape.id, {
          width: 100,
          height: 100,
        });
      } else if (shape.type === "circle" && shape.radius < 5) {
        useBoardStore.getState().updateElement(shape.id, {
          radius: 50,
        });
      }
    }

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

  // ── Pointer ──

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    moveDraw(e.layerX, e.layerY);
  });

  const onPointerUp = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startPointerRectDraw = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      beginDraw(e.evt.layerX, e.evt.layerY, "rect");

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [beginDraw, onPointerMove, onPointerUp],
  );

  const startPointerCircleDraw = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      beginDraw(e.evt.layerX, e.evt.layerY, "circle");

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
    );
  });

  const onTouchDrawEnd = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startTouchRectDraw = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches[0];
      if (!touch) return;
      const stage = e.target.getStage();
      if (!stage) return;
      const rect = stage.container().getBoundingClientRect();
      containerRectRef.current = rect;

      beginDraw(touch.clientX - rect.left, touch.clientY - rect.top, "rect");

      window.addEventListener("touchmove", onTouchDrawMove);
      window.addEventListener("touchend", onTouchDrawEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchDrawMove);
        window.removeEventListener("touchend", onTouchDrawEnd);
      };
    },
    [beginDraw, onTouchDrawMove, onTouchDrawEnd],
  );

  const startTouchCircleDraw = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches[0];
      if (!touch) return;
      const stage = e.target.getStage();
      if (!stage) return;
      const rect = stage.container().getBoundingClientRect();
      containerRectRef.current = rect;

      beginDraw(touch.clientX - rect.left, touch.clientY - rect.top, "circle");

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
    startPointerRectDraw,
    startPointerCircleDraw,
    startTouchRectDraw,
    startTouchCircleDraw,
  };
};
