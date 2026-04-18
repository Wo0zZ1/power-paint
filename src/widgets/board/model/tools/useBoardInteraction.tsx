import type Konva from "konva";
import { useCallback } from "react";

import { useBoardStore, useContextMenuStore } from "../core";
import { getElements, getElementsBounds, screenToCanvas } from "../lib";

import { shouldPan, useViewport } from "./useViewport";

import {
  useCircleDrawing,
  useDragElements,
  useDrawing,
  useEraser,
  useRectDrawing,
  useSelectionRect,
  useTextDrawing,
} from ".";

interface UseBoardInteractionProps {
  canEdit?: boolean;
}

export const useBoardInteraction = ({ canEdit }: UseBoardInteractionProps) => {
  const { handleZoom, startPointerPan, startTouchPan } = useViewport();
  const { startPointerSelect, startTouchSelect } = useSelectionRect();
  const { startPointerDrag, startTouchDrag } = useDragElements({
    canEdit: canEdit || false,
  });
  const { startPointerDraw, startTouchDraw } = useDrawing();
  const { startPointerRectDraw, startTouchRectDraw } = useRectDrawing();
  const { startPointerCircleDraw, startTouchCircleDraw } = useCircleDrawing();
  const { startPointerTextDraw, startTouchTextDraw } = useTextDrawing();
  const { startPointerErase, startTouchErase } = useEraser();

  const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    if (!canEdit) return;

    const stage = e.target.getStage();
    if (!stage) return;

    let clickType: "canvas" | "element" = "element";
    const store = useBoardStore.getState();

    if (e.target === stage) {
      clickType = "canvas";

      const pos = stage.getPointerPosition();
      if (
        pos &&
        store.selectedIds.size > 0 &&
        store.selectionType === "transform"
      ) {
        const [targetX, targetY] = screenToCanvas(pos.x, pos.y, store.viewport);

        const selectedElements = getElements(
          Array.from(store.elements.values()),
          Array.from(store.selectedIds),
        );

        const bounds = getElementsBounds(selectedElements);
        if (bounds) {
          if (
            targetX >= bounds.minX &&
            targetX <= bounds.maxX &&
            targetY >= bounds.minY &&
            targetY <= bounds.maxY
          ) {
            clickType = "element";
          } else {
            store.deselectMany(store.selectedIds);
          }
        }
      } else {
        store.deselectMany(store.selectedIds);
      }
    } else {
      const id = e.target.id();

      if (!store.selectedIds.has(id)) {
        store.setTool("select");
        store.setSelectionType("transform");
        store.pureSelect(id);
      }
    }

    const pos = stage.getPointerPosition();

    useContextMenuStore
      .getState()
      .openMenu(e.evt.clientX, e.evt.clientY, clickType, pos?.x, pos?.y);
  };

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      const {
        tool,
        viewport,
        elements,
        selectedIds,
        selectionType,
        clearSelection,
      } = useBoardStore.getState();

      if (tool === "hand" || shouldPan(e.evt)) return startPointerPan(e);

      if (e.evt.button !== 0) return;

      if (tool === "select") {
        const stage = e.target.getStage();
        if (
          stage &&
          e.target === stage &&
          selectedIds.size > 0 &&
          selectionType === "transform"
        ) {
          const pos = stage.getPointerPosition();
          if (pos) {
            const [targetX, targetY] = screenToCanvas(pos.x, pos.y, viewport);
            const selectedElements = getElements(
              Array.from(elements.values()),
              Array.from(selectedIds),
            );

            const bounds = getElementsBounds(selectedElements);
            if (
              bounds &&
              targetX >= bounds.minX &&
              targetX <= bounds.maxX &&
              targetY >= bounds.minY &&
              targetY <= bounds.maxY
            ) {
              return startPointerDrag(e);
            }
          }
        }

        return startPointerSelect(e);
      }

      clearSelection();

      if (!canEdit) return;

      if (tool === "draw") return startPointerDraw(e);
      if (tool === "rect") return startPointerRectDraw(e);
      if (tool === "circle") return startPointerCircleDraw(e);
      if (tool === "text") return startPointerTextDraw(e);
      if (tool === "eraser") return startPointerErase(e);
      const _: never = tool;
      return _;
    },
    [
      canEdit,
      startPointerPan,
      startPointerSelect,
      startPointerDrag,
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

      const {
        tool,
        clearSelection,
        viewport,
        elements,
        selectedIds,
        selectionType,
      } = useBoardStore.getState();

      if (tool === "hand" || e.evt.touches.length >= 2) return startTouchPan(e);

      if (e.evt.touches.length > 1) return;

      if (tool === "select") {
        const stage = e.target.getStage();
        if (
          stage &&
          e.target === stage &&
          selectedIds.size > 0 &&
          selectionType === "transform"
        ) {
          const pos = stage.getPointerPosition();
          if (pos) {
            const [targetX, targetY] = screenToCanvas(pos.x, pos.y, viewport);
            const selectedElements = getElements(
              Array.from(elements.values()),
              Array.from(selectedIds),
            );

            const bounds = getElementsBounds(selectedElements);
            if (
              bounds &&
              targetX >= bounds.minX &&
              targetX <= bounds.maxX &&
              targetY >= bounds.minY &&
              targetY <= bounds.maxY
            ) {
              return startTouchDrag(e);
            }
          }
        }
        return startTouchSelect(e);
      }

      clearSelection();

      if (!canEdit) return;

      if (tool === "draw") return startTouchDraw(e);
      if (tool === "rect") return startTouchRectDraw(e);
      if (tool === "circle") return startTouchCircleDraw(e);
      if (tool === "text") return startTouchTextDraw(e);
      if (tool === "eraser") return startTouchErase(e);
      const _: never = tool;
      return _;
    },
    [
      canEdit,
      startTouchPan,
      startTouchSelect,
      startTouchDrag,
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
    handleContextMenu,
    handleZoom,
  };
};
