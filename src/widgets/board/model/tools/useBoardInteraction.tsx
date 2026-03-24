import type Konva from "konva";
import { useCallback, type RefObject } from "react";

import { useBoardStore } from "../core";

import { shouldPan, useViewport } from "./useViewport";

import {
  useCircleDrawing,
  useDrawing,
  useEraser,
  useRectDrawing,
  useSelectionRect,
  useTextDrawing,
} from ".";

interface UseBoardInteractionProps {
  selectionRectRef: RefObject<Konva.Rect | null>;
}

export const useBoardInteraction = ({
  selectionRectRef,
}: UseBoardInteractionProps) => {
  const { handleZoom, startPointerPan, startTouchPan } = useViewport();
  const { startPointerSelect, startTouchSelect } = useSelectionRect({
    rectRef: selectionRectRef,
  });
  const { startPointerDraw, startTouchDraw } = useDrawing();
  const { startPointerRectDraw, startTouchRectDraw } = useRectDrawing();
  const { startPointerCircleDraw, startTouchCircleDraw } = useCircleDrawing();
  const { startPointerTextDraw, startTouchTextDraw } = useTextDrawing();
  const { startPointerErase, startTouchErase } = useEraser();

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      const { tool, clearSelection } = useBoardStore.getState();

      if (tool === "hand" || shouldPan(e.evt)) return startPointerPan(e);

      if (e.evt.button !== 0) return;

      if (tool === "select") return startPointerSelect(e);

      clearSelection();

      if (tool === "draw") return startPointerDraw(e);
      if (tool === "rect") return startPointerRectDraw(e);
      if (tool === "circle") return startPointerCircleDraw(e);
      if (tool === "text") return startPointerTextDraw(e);
      if (tool === "eraser") return startPointerErase(e);
      const _: never = tool;
      return _;
    },
    [
      startPointerPan,
      startPointerSelect,
      startPointerDraw,
      startPointerRectDraw,
      startPointerCircleDraw,
      startPointerTextDraw,
      startPointerErase,
    ],
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>): void => {
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
      if (tool === "eraser") return startTouchErase(e);
      const _: never = tool;
      return _;
    },
    [
      startTouchPan,
      startTouchSelect,
      startTouchDraw,
      startTouchRectDraw,
      startTouchCircleDraw,
      startTouchTextDraw,
      startTouchErase,
    ],
  );

  return {
    handlePointerDown,
    handleTouchStart,
    handleZoom,
  };
};
