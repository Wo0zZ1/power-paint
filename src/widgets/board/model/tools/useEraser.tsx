import type { KonvaEventObject } from "konva/lib/Node";
import type { Stage } from "konva/lib/Stage";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";

export const useEraser = () => {
  const stageRef = useRef<Stage | null>(null);
  const stageRectRef = useRef<DOMRect | null>(null);

  const originRef = useRef({ x: 0, y: 0 });

  const stopListeners = useRef(() => {});

  // ── Pure core ──

  const beginErase = useCallback(
    (_clientX: number, _clientY: number, stage: Stage) => {
      const stageRect = stage.container().getBoundingClientRect();
      stageRef.current = stage;
      stageRectRef.current = stageRect;

      const x = _clientX - stageRect.left;
      const y = _clientY - stageRect.top;

      originRef.current = { x, y };

      const { clearSelection, setSelectionType } = useBoardStore.getState();

      clearSelection();
      setSelectionType("delete");
    },
    [],
  );

  const moveErase = useCallback(
    (clientX: number, clientY: number, altKey: boolean) => {
      if (!stageRef.current) return;

      const shapes = stageRef.current.getAllIntersections({
        x: clientX - stageRectRef.current!.left,
        y: clientY - stageRectRef.current!.top,
      });

      const selectedIds = new Set(shapes.map((shape) => shape.id()));

      const { selectMany, deselectMany } = useBoardStore.getState();

      if (altKey) deselectMany(selectedIds);
      else selectMany(selectedIds);
    },
    [],
  );

  const endErase = useCallback(() => {
    const { removeSelectedElements, clearSelection, setSelectionType } =
      useBoardStore.getState();

    removeSelectedElements();
    clearSelection();
    setSelectionType("none");
    stageRef.current = null;
  }, []);

  const cancelErase = useCallback(() => {
    const { clearSelection, setSelectionType } = useBoardStore.getState();

    clearSelection();
    setSelectionType("none");
    stageRef.current = null;
  }, []);

  // ── Pointer (mouse/pen — touch фильтруется) ──

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    moveErase(e.clientX, e.clientY, e.altKey);
  });

  const onPointerUp = useCallback(() => {
    endErase();
    stopListeners.current();
  }, [endErase]);

  const startPointerErase = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      const stage = e.target.getStage();
      if (!stage) return;

      beginErase(e.evt.clientX, e.evt.clientY, stage);
      moveErase(e.evt.clientX, e.evt.clientY, e.evt.altKey);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [beginErase, moveErase, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const onTouchEraseMove = useThrottledCallback((e: TouchEvent) => {
    if (e.touches.length >= 2) {
      cancelErase();
      stopListeners.current();
      return;
    }

    const touch = e.touches[0];

    moveErase(touch.clientX, touch.clientY, e.altKey);
  });

  const onTouchEraseEnd = useCallback(() => {
    endErase();
    stopListeners.current();
  }, [endErase]);

  const startTouchErase = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      if (e.evt.cancelable) e.evt.preventDefault();

      const touch = e.evt.touches[0];
      if (!touch) return;

      const stage = e.target.getStage();
      if (!stage) return;

      beginErase(touch.clientX, touch.clientY, stage);
      moveErase(touch.clientX, touch.clientY, e.evt.altKey);

      window.addEventListener("touchmove", onTouchEraseMove);
      window.addEventListener("touchend", onTouchEraseEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchEraseMove);
        window.removeEventListener("touchend", onTouchEraseEnd);
      };
    },
    [beginErase, moveErase, onTouchEraseMove, onTouchEraseEnd],
  );

  useEffect(() => {
    return () => stopListeners.current();
  });

  return { startPointerErase, startTouchErase };
};
