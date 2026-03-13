import type Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import type { RefObject } from "react";
import { useCallback, useRef } from "react";

import { isElementFullyInsideRect } from "./selection/utils";
import { useBoardStore } from "./useBoardStore";
import { screenToCanvas } from "./viewport/utils";

interface UseSelectionRectProps {
  rectRef: RefObject<Konva.Rect | null>;
}

export const useSelectionRect = ({ rectRef }: UseSelectionRectProps) => {
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<Vector2d | null>(null);

  const removeSelection = useCallback(() => {
    startRef.current = null;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (!rectRef.current) return;

    rectRef.current.visible(false);
    rectRef.current.getLayer()?.batchDraw();
  }, [rectRef]);

  const applySelection = useCallback(
    (globalX: number, globalY: number, shiftKey: boolean) => {
      if (!startRef.current || !rectRef.current) return;

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

      elements.forEach((element, id) => {
        const isSelected = isElementFullyInsideRect(selectionRect, element);
        if (isSelected) {
          useBoardStore.getState().select(id);
        } else if (!shiftKey) {
          useBoardStore.getState().deselect(id);
        }
      });
    },
    [rectRef],
  );

  const onWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      const [globalX, globalY] = screenToCanvas(
        e.layerX,
        e.layerY,
        useBoardStore.getState().viewport,
      );

      rafRef.current = requestAnimationFrame(() =>
        applySelection(globalX, globalY, e.shiftKey),
      );
    },
    [applySelection],
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

      const stage = rectRef.current.getStage()!;

      const shape = stage.getIntersection({ x: canvasX, y: canvasY });
      if (shape) {
        const stage = rectRef.current.getStage()!;
        const transformer = stage.findOne<Konva.Transformer>("#transformer")!;

        if (transformer.children.some((child) => child.id() === shape.id()))
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

  return { startSelecting };
};
