import type Konva from "konva";
import { useCallback, type RefObject } from "react";

import { useBoardStore } from "./useBoardStore";
import { useCircleDrawing } from "./useCircleDrawing";
import { useDrawing } from "./useDrawing";
import { useRectDrawing } from "./useRectDrawing";
import { useSelectionRect } from "./useSelectionRect";
import { useTextDrawing } from "./useTextDrawing";
import { shouldPan, useViewport } from "./useViewport";

interface UseBoardInteractionProps {
  selectionRectRef: RefObject<Konva.Rect | null>;
}

export const useBoardInteraction = ({
  selectionRectRef,
}: UseBoardInteractionProps) => {
  const { handleZoom, startPointerPan, startTouchPan } = useViewport();
  const { startPointerDraw, startTouchDraw } = useDrawing();
  const { startPointerRectDraw, startTouchRectDraw } = useRectDrawing();
  const { startPointerCircleDraw, startTouchCircleDraw } = useCircleDrawing();
  const { startPointerTextDraw, startTouchTextDraw } = useTextDrawing();
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
      if (tool === "text") return startPointerTextDraw(e);
    },
    [
      startPointerPan,
      startPointerSelect,
      startPointerDraw,
      startPointerRectDraw,
      startPointerCircleDraw,
      startPointerTextDraw,
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
      if (tool === "text") return startTouchTextDraw(e);
    },
    [
      startTouchPan,
      startTouchSelect,
      startTouchDraw,
      startTouchRectDraw,
      startTouchCircleDraw,
      startTouchTextDraw,
    ],
  );

  return {
    handlePointerDown,
    handleTouchStart,
    handleZoom,
  };
};
