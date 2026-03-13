import type Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

import { isElementFullyInsideRect } from "../lib/selection";
import { useThrottledCallback } from "../lib/useThrottledCallback";
import { screenToCanvas } from "../lib/viewport";

import { useBoardStore } from "./useBoardStore";

interface UseSelectionRectProps {
  rectRef: RefObject<Konva.Rect | null>;
}

export const useSelectionRect = ({ rectRef }: UseSelectionRectProps) => {
  const startRef = useRef<Vector2d | null>(null);

  const removeSelection = useCallback(() => {
    startRef.current = null;
    if (!rectRef.current) return;

    rectRef.current.visible(false);
    rectRef.current.getLayer()?.batchDraw();
  }, [rectRef]);

  const onWindowMouseMove = useThrottledCallback(
    (e: MouseEvent) => {
      if (!startRef.current || !rectRef.current) return;

      const [globalX, globalY] = screenToCanvas(
        e.layerX,
        e.layerY,
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
      const selectedIds = new Set(useBoardStore.getState().selectedIds);

      elements.forEach((element, id) => {
        const isSelected = isElementFullyInsideRect(selectionRect, element);
        if (isSelected) {
          useBoardStore.getState().select(id);
          selectedIds.add(id);
        } else if (!e.shiftKey) {
          useBoardStore.getState().deselect(id);
          selectedIds.delete(id);
        }
      });

      useBoardStore.getState().pureSelectMany(selectedIds);
    },
    [rectRef],
  );

  const onWindowMouseUp = useCallback(() => {
    removeSelection();

    window.removeEventListener("mousemove", onWindowMouseMove);
  }, [removeSelection, onWindowMouseMove]);

  const startSelecting = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!rectRef.current) return;

      const canvasX = e.evt.layerX;
      const canvasY = e.evt.layerY;

      const [x, y] = screenToCanvas(
        canvasX,
        canvasY,
        useBoardStore.getState().viewport,
      );

      startRef.current = { x, y };

      const stage = rectRef.current.getStage();
      if (!stage) return;

      const shape = stage.getIntersection({ x: canvasX, y: canvasY });
      if (shape) {
        const transformer = stage.findOne<Konva.Transformer>("#transformer");

        // Если клик на элементе transformer, игнорируем
        if (transformer?.children.some((child) => child.id() === shape.id()))
          return;

        const selected = useBoardStore.getState().selectedIds.has(shape.id());

        if (e.evt.shiftKey) useBoardStore.getState().toggleSelect(shape.id());
        else if (!selected) useBoardStore.getState().pureSelect(shape.id());
        return;
      }

      if (!e.evt.shiftKey) useBoardStore.getState().clearSelection();

      window.addEventListener("mousemove", onWindowMouseMove);
      window.addEventListener("mouseup", onWindowMouseUp);
    },
    [rectRef, onWindowMouseMove, onWindowMouseUp],
  );

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("mouseup", onWindowMouseUp);
    };
  }, [onWindowMouseMove, onWindowMouseUp]);

  return { startSelecting };
};
