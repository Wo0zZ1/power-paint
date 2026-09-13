import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Transformer } from "konva/lib/shapes/Transformer";
import type { Stage } from "konva/lib/Stage";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";
import { screenToCanvas, isElementFullyInsideRect } from "../lib";

type SelectResult = "marquee" | "element" | "transformer";

export const useSelectionRect = () => {
  const startRef = useRef<Konva.Vector2d | null>(null);

  const stopListeners = useRef(() => {});

  // ── Pure core ──

  const beginSelect = useCallback(
    (
      layerX: number,
      layerY: number,
      stage: Stage,
      shift: boolean,
    ): SelectResult | null => {
      const {
        viewport,
        selectedIds,
        toggleSelect,
        pureSelect,
        clearSelection,
        setSelectionType,
      } = useBoardStore.getState();

      setSelectionType("transform");

      const [x, y] = screenToCanvas(layerX, layerY, viewport);
      startRef.current = { x, y };

      const shape = stage.getIntersection({ x: layerX, y: layerY });
      if (shape) {
        const transformer = stage.findOne<Transformer>("#transformer");
        if (transformer?.children.some((child) => child.id() === shape.id()))
          return "transformer";

        const isSelected = selectedIds.has(shape.id());
        if (shift) toggleSelect(shape.id());
        else if (!isSelected) pureSelect(shape.id());

        return "element";
      }

      if (!shift) clearSelection();
      return "marquee";
    },
    [],
  );

  const moveSelect = useCallback(
    (layerX: number, layerY: number, shift: boolean) => {
      const { selectionRect } = useBoardStore.getState();

      if (!startRef.current || !selectionRect) return;

      const [globalX, globalY] = screenToCanvas(
        layerX,
        layerY,
        useBoardStore.getState().viewport,
      );

      const width = globalX - startRef.current.x;
      const height = globalY - startRef.current.y;

      const newSelectionRectAttrs = {
        x: startRef.current.x,
        y: startRef.current.y,
        width,
        height,
      };

      selectionRect.setAttrs(newSelectionRectAttrs);

      const elements = useBoardStore.getState().elements;
      const prevSelected = useBoardStore.getState().selectedIds;
      const selectedIds = new Set<string>();

      elements.forEach((element, id) => {
        if (isElementFullyInsideRect(newSelectionRectAttrs, element))
          selectedIds.add(id);
        else if (shift && prevSelected.has(id)) selectedIds.add(id);
      });

      useBoardStore.getState().pureSelectMany(selectedIds);
    },
    [],
  );

  const endSelect = useCallback(() => {
    const { selectionRect } = useBoardStore.getState();

    if (!selectionRect) return;

    selectionRect.setAttrs({ x: 0, y: 0, width: 0, height: 0 });
    selectionRect.visible(false);

    startRef.current = null;
  }, []);

  // ── Pointer (mouse/pen — touch фильтруется) ──

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    const stage = useBoardStore.getState().stage;
    if (!stage) return;

    const stageRect = stage.container().getBoundingClientRect();

    moveSelect(
      e.clientX - stageRect.left,
      e.clientY - stageRect.top,
      e.shiftKey,
    );
  });

  const onPointerUp = useCallback(() => {
    endSelect();
    stopListeners.current();
  }, [endSelect]);

  const startPointerSelect = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      const { stage, selectionRect } = useBoardStore.getState();
      if (!selectionRect || !stage) return;

      selectionRect.visible(true);

      const stageRect = stage.container().getBoundingClientRect();

      const result = beginSelect(
        e.evt.clientX - stageRect.left,
        e.evt.clientY - stageRect.top,
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
    [beginSelect, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const onTouchSelectMove = useThrottledCallback((e: TouchEvent) => {
    if (e.touches.length >= 2) {
      endSelect();
      stopListeners.current();
      return;
    }

    const touch = e.touches[0];
    if (!touch) return;

    const stage = useBoardStore.getState().stage;
    if (!stage) return;

    const stageRect = stage.container().getBoundingClientRect();

    moveSelect(
      touch.clientX - stageRect.left,
      touch.clientY - stageRect.top,
      false,
    );
  });

  const onTouchSelectEnd = useCallback(() => {
    endSelect();
    stopListeners.current();
  }, [endSelect]);

  const startTouchSelect = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches[0];

      const { stage, selectionRect } = useBoardStore.getState();
      if (!selectionRect || !stage) return;

      selectionRect.visible(true);

      const stageRect = stage.container().getBoundingClientRect();

      const layerX = touch.clientX - stageRect.left;
      const layerY = touch.clientY - stageRect.top;

      const result = beginSelect(layerX, layerY, stage, false);
      if (result !== "marquee") return;

      window.addEventListener("touchmove", onTouchSelectMove);
      window.addEventListener("touchend", onTouchSelectEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchSelectMove);
        window.removeEventListener("touchend", onTouchSelectEnd);
      };
    },
    [beginSelect, onTouchSelectMove, onTouchSelectEnd],
  );

  useEffect(() => {
    return () => stopListeners.current();
  }, []);

  return { startPointerSelect, startTouchSelect };
};
