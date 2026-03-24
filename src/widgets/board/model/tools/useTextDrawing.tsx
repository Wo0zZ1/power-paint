import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore, DEFAULT_CAPTURE_TIMEOUT } from "../core";
import { screenToCanvas, generateId } from "../lib";
import { createText } from "../types";

export const useTextDrawing = () => {
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

    const shape = createText({ id, x: cx, y: cy, text: "Text", fontSize: 24 });

    useBoardStore.getState().addElement(shape);
  }, []);

  const moveDraw = useCallback((layerX: number, layerY: number) => {
    if (!shapeIdRef.current) return;

    const viewport = useBoardStore.getState().viewport;
    const [cx, cy] = screenToCanvas(layerX, layerY, viewport);

    // Allow slight movement before unclicking
    useBoardStore.getState().updateElement(shapeIdRef.current, {
      x: cx,
      y: cy,
    });
  }, []);

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
    );
  });

  const onPointerUp = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startPointerTextDraw = useCallback(
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
    );
  });

  const onTouchDrawEnd = useCallback(() => {
    endDraw();
    stopListeners.current();
  }, [endDraw]);

  const startTouchTextDraw = useCallback(
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
    startPointerTextDraw,
    startTouchTextDraw,
  };
};
