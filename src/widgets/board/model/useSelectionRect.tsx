import type Konva from "konva";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

import { isElementFullyInsideRect } from "../lib/selection";
import { useThrottledCallback } from "../lib/useThrottledCallback";
import { screenToCanvas } from "../lib/viewport";

import { useBoardStore } from "./useBoardStore";

interface UseSelectionRectProps {
  rectRef: RefObject<Konva.Rect | null>;
}

export type SelectResult = "marquee" | "element" | "transformer";

export const useSelectionRect = ({ rectRef }: UseSelectionRectProps) => {
  const startRef = useRef<Konva.Vector2d | null>(null);

  const stopListeners = useRef(() => {});

  const removeSelection = useCallback(() => {
    startRef.current = null;
    if (!rectRef.current) return;

    rectRef.current.visible(false);
    rectRef.current.getLayer()?.batchDraw();
  }, [rectRef]);

  // ── Pure core ──

  const beginSelect = useCallback(
    (
      layerX: number,
      layerY: number,
      stage: Konva.Stage,
      shift: boolean,
    ): SelectResult | null => {
      if (!rectRef.current) return null;

      const [x, y] = screenToCanvas(
        layerX,
        layerY,
        useBoardStore.getState().viewport,
      );
      startRef.current = { x, y };

      const shape = stage.getIntersection({ x: layerX, y: layerY });
      if (shape) {
        const transformer = stage.findOne<Konva.Transformer>("#transformer");
        if (transformer?.children.some((child) => child.id() === shape.id()))
          return "transformer";

        const selected = useBoardStore.getState().selectedIds.has(shape.id());
        if (shift) useBoardStore.getState().toggleSelect(shape.id());
        else if (!selected) useBoardStore.getState().pureSelect(shape.id());

        return "element";
      }

      if (!shift) useBoardStore.getState().clearSelection();
      return "marquee";
    },
    [rectRef],
  );

  const moveSelect = useCallback(
    (layerX: number, layerY: number, shift: boolean) => {
      if (!startRef.current || !rectRef.current) return;

      const [globalX, globalY] = screenToCanvas(
        layerX,
        layerY,
        useBoardStore.getState().viewport,
      );

      const width = globalX - startRef.current.x;
      const height = globalY - startRef.current.y;

      const selectionRect = {
        x: startRef.current.x,
        y: startRef.current.y,
        width,
        height,
      };

      rectRef.current.setAttrs(selectionRect);
      rectRef.current.visible(true);
      rectRef.current.getLayer()?.batchDraw();

      const elements = useBoardStore.getState().elements;
      const prevSelected = useBoardStore.getState().selectedIds;
      const selectedIds = new Set<string>();

      elements.forEach((element, id) => {
        if (isElementFullyInsideRect(selectionRect, element)) {
          selectedIds.add(id);
        } else if (shift && prevSelected.has(id)) {
          selectedIds.add(id);
        }
      });

      useBoardStore.getState().pureSelectMany(selectedIds);
    },
    [rectRef],
  );

  const endSelect = useCallback(() => {
    removeSelection();
  }, [removeSelection]);

  // ── Pointer (mouse/pen — touch фильтруется) ──

  const onPointerMove = useThrottledCallback(
    (e: PointerEvent) => {
      moveSelect(e.layerX, e.layerY, e.shiftKey);
    },
    [moveSelect],
  );

  const onPointerUp = useCallback(() => {
    endSelect();
    stopListeners.current();
  }, [endSelect]);

  const startPointerSelect = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      const stage = rectRef.current?.getStage();
      if (!stage) return;

      const result = beginSelect(
        e.evt.layerX,
        e.evt.layerY,
        stage,
        e.evt.shiftKey,
      );
      if (result !== "marquee") return;

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [rectRef, beginSelect, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const containerRectRef = useRef<DOMRect | null>(null);

  const onTouchSelectMove = useThrottledCallback(
    (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        endSelect();
        stopListeners.current();
        return;
      }

      const touch = e.touches[0];
      if (!touch || !containerRectRef.current) return;

      moveSelect(
        touch.clientX - containerRectRef.current.left,
        touch.clientY - containerRectRef.current.top,
        false,
      );
    },
    [moveSelect, endSelect],
  );

  const onTouchSelectEnd = useCallback(() => {
    endSelect();
    stopListeners.current();
  }, [endSelect]);

  const startTouchSelect = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>): SelectResult | null => {
      const touch = e.evt.touches[0];
      if (!touch) return null;
      const stage = rectRef.current?.getStage();
      if (!stage) return null;

      const rect = stage.container().getBoundingClientRect();
      containerRectRef.current = rect;

      const layerX = touch.clientX - rect.left;
      const layerY = touch.clientY - rect.top;

      const result = beginSelect(layerX, layerY, stage, false);
      if (result !== "marquee") return result;

      window.addEventListener("touchmove", onTouchSelectMove);
      window.addEventListener("touchend", onTouchSelectEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchSelectMove);
        window.removeEventListener("touchend", onTouchSelectEnd);
      };

      return result;
    },
    [rectRef, beginSelect, onTouchSelectMove, onTouchSelectEnd],
  );

  useEffect(() => {
    return () => stopListeners.current();
  }, []);

  return { startPointerSelect, startTouchSelect, removeSelection };
};
