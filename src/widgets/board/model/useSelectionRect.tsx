import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Transformer } from "konva/lib/shapes/Transformer";
import type { Stage } from "konva/lib/Stage";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";

import { isElementFullyInsideRect } from "../lib/selection";
import { useThrottledCallback } from "../lib/useThrottledCallback";
import { screenToCanvas } from "../lib/viewport";

import { useBoardStore } from "./useBoardStore";

interface UseSelectionRectProps {
  rectRef: RefObject<Konva.Rect | null>;
}

type SelectResult = "marquee" | "element" | "transformer";

export const useSelectionRect = ({ rectRef }: UseSelectionRectProps) => {
  const startRef = useRef<Konva.Vector2d | null>(null);
  const containerRectRef = useRef<DOMRect | null>(null);

  const stopListeners = useRef(() => {});

  // ── Pure core ──

  const beginSelect = useCallback(
    (
      layerX: number,
      layerY: number,
      stage: Stage,
      shift: boolean,
    ): SelectResult | null => {
      if (!rectRef.current) return null;

      useBoardStore.getState().setSelectionType("transform");

      const [x, y] = screenToCanvas(
        layerX,
        layerY,
        useBoardStore.getState().viewport,
      );
      startRef.current = { x, y };

      const shape = stage.getIntersection({ x: layerX, y: layerY });
      if (shape) {
        const transformer = stage.findOne<Transformer>("#transformer");
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
    const rect = rectRef.current;
    if (!rect) return;

    rect.setAttrs({ x: 0, y: 0, width: 0, height: 0 });
    rect.visible(false);

    startRef.current = null;
  }, [rectRef]);

  // ── Pointer (mouse/pen — touch фильтруется) ──

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    if (!containerRectRef.current) return;
    moveSelect(
      e.clientX - containerRectRef.current.left,
      e.clientY - containerRectRef.current.top,
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

      const rect = rectRef.current;
      if (!rect) return;

      rect.visible(true);

      const stage = rect.getStage();
      if (!stage) return;

      const stageRect = stage.container().getBoundingClientRect();
      containerRectRef.current = stageRect;

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
    [rectRef, beginSelect, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const onTouchSelectMove = useThrottledCallback((e: TouchEvent) => {
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
  });

  const onTouchSelectEnd = useCallback(() => {
    endSelect();
    stopListeners.current();
  }, [endSelect]);

  const startTouchSelect = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches[0];

      const rect = rectRef.current;
      if (!rect) return;

      rect.visible(true);

      const stage = rect.getStage();
      if (!stage) return;

      const stageRect = stage.container().getBoundingClientRect();
      containerRectRef.current = stageRect;

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
    [rectRef, beginSelect, onTouchSelectMove, onTouchSelectEnd],
  );

  useEffect(() => {
    return () => stopListeners.current();
  }, []);

  return { startPointerSelect, startTouchSelect };
};
