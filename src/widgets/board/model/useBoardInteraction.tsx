import type Konva from "konva";
import { useCallback, type RefObject } from "react";

import { useBoardStore } from "./useBoardStore";
import { useDrawing } from "./useDrawing";
import { useSelectionRect } from "./useSelectionRect";
import { useShapeDrawing } from "./useShapeDrawing";
import { shouldPan, useViewport } from "./useViewport";

interface UseBoardInteractionProps {
  selectionRectRef: RefObject<Konva.Rect | null>;
}

export const useBoardInteraction = ({
  selectionRectRef,
}: UseBoardInteractionProps) => {
  const { handleZoom, startPointerPan, startTouchPan } = useViewport();
  const { startPointerDraw, startTouchDraw } = useDrawing();
  const {
    startPointerRectDraw,
    startPointerCircleDraw,
    startTouchRectDraw,
    startTouchCircleDraw,
  } = useShapeDrawing();
  const { startPointerSelect, startTouchSelect } = useSelectionRect({
    rectRef: selectionRectRef,
  });

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      if (shouldPan(e.evt)) return startPointerPan(e);

      if (e.evt.button !== 0) return;

      const { tool, clearSelection } = useBoardStore.getState();

      if (tool === "select") return startPointerSelect(e);

      clearSelection();

      if (tool === "draw") return startPointerDraw(e);
      if (tool === "rect") return startPointerRectDraw(e);
      if (tool === "circle") return startPointerCircleDraw(e);
    },
    [
      startPointerPan,
      startPointerSelect,
      startPointerDraw,
      startPointerRectDraw,
      startPointerCircleDraw,
    ],
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.cancelable) e.evt.preventDefault();

      const { tool, clearSelection } = useBoardStore.getState();

      if (tool === "hand" || e.evt.touches.length >= 2) return startTouchPan(e);

      if (e.evt.touches.length > 1) return;

      if (tool === "select") return startTouchSelect(e);

      clearSelection();

      if (tool === "draw") return startTouchDraw(e);
      if (tool === "rect") return startTouchRectDraw(e);
      if (tool === "circle") return startTouchCircleDraw(e);
    },
    [
      startTouchPan,
      startTouchSelect,
      startTouchDraw,
      startTouchRectDraw,
      startTouchCircleDraw,
    ],
  );

  return {
    handlePointerDown,
    handleTouchStart,
    handleZoom,
  };
};
