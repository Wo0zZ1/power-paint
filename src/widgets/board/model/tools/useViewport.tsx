import type { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";
import { zoomTowardsMouse } from "../lib";

/**
 * Определяет, должен ли текущий mousedown начать pan (для pointer-событий).
 */
export function shouldPan(e: PointerEvent): boolean {
  const { tool, modifiers } = useBoardStore.getState();

  if (e.button === 1) return true;
  if (tool === "hand") return true;
  if ((modifiers.space || modifiers.ctrl) && e.button === 0) return true;

  return false;
}

export const useViewport = () => {
  const panStartRef = useRef({ x: 0, y: 0 });
  const pinchRef = useRef<{ dist: number; midX: number; midY: number } | null>(
    null,
  );

  const stopListeners = useRef(() => {});

  // ── Pure core ──

  const beginPan = useCallback((clientX: number, clientY: number) => {
    panStartRef.current = { x: clientX, y: clientY };
  }, []);

  const movePan = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - panStartRef.current.x;
    const dy = clientY - panStartRef.current.y;

    const viewport = useBoardStore.getState().viewport;
    useBoardStore.getState().updateViewport({
      x: viewport.x + dx,
      y: viewport.y + dy,
    });

    panStartRef.current = { x: clientX, y: clientY };
  }, []);

  const startPinch = useCallback(
    (t0x: number, t0y: number, t1x: number, t1y: number) => {
      const dist = Math.hypot(t1x - t0x, t1y - t0y);
      const midX = (t0x + t1x) / 2;
      const midY = (t0y + t1y) / 2;
      pinchRef.current = { dist, midX, midY };
    },
    [],
  );

  const movePinch = useCallback(
    (t0x: number, t0y: number, t1x: number, t1y: number) => {
      const dist = Math.hypot(t1x - t0x, t1y - t0y);
      const midX = (t0x + t1x) / 2;
      const midY = (t0y + t1y) / 2;

      if (!pinchRef.current) {
        pinchRef.current = { dist, midX, midY };
        return;
      }

      const prev = pinchRef.current;
      const viewport = useBoardStore.getState().viewport;

      const scaleBy = dist / prev.dist;
      const zoomed = zoomTowardsMouse(midX, midY, viewport, scaleBy);

      const dx = midX - prev.midX;
      const dy = midY - prev.midY;

      useBoardStore.getState().updateViewport({
        x: zoomed.x + dx,
        y: zoomed.y + dy,
        scale: zoomed.scale,
      });

      pinchRef.current = { dist, midX, midY };
    },
    [],
  );

  const endPinch = useCallback(() => {
    pinchRef.current = null;
  }, []);

  // ── Wheel ──

  const handleZoom = useCallback((e: KonvaEventObject<WheelEvent>) => {
    if (e.evt.cancelable) e.evt.preventDefault();
    e.evt.stopPropagation();

    const scaleBy = e.evt.deltaY < 0 ? 1.1 : 0.9;
    const viewport = useBoardStore.getState().viewport;

    const stage = e.target.getStage();
    if (!stage) return;

    const container = stage.container();
    const rect = container.getBoundingClientRect();
    const mouseX = e.evt.clientX - rect.left;
    const mouseY = e.evt.clientY - rect.top;

    const newViewport = zoomTowardsMouse(mouseX, mouseY, viewport, scaleBy);

    useBoardStore.getState().updateViewport(newViewport);
  }, []);

  // ── Pointer (mouse/pen — touch фильтруется) ──

  const onPointerMove = useThrottledCallback((e: PointerEvent) => {
    movePan(e.clientX, e.clientY);
  });

  const onPointerUp = useCallback(() => {
    stopListeners.current();
  }, []);

  const startPointerPan = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      e.evt.preventDefault();
      e.evt.stopPropagation();

      beginPan(e.evt.clientX, e.evt.clientY);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      stopListeners.current = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    },
    [beginPan, onPointerMove, onPointerUp],
  );

  // ── Touch ──

  const onTouchPanMove = useThrottledCallback((e: TouchEvent) => {
    if (e.touches.length === 1)
      return movePan(e.touches[0].clientX, e.touches[0].clientY);

    movePinch(
      e.touches[0].clientX,
      e.touches[0].clientY,
      e.touches[1].clientX,
      e.touches[1].clientY,
    );
  });

  const onTouchPanEnd = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 0) return stopListeners.current();

      if (e.touches.length === 1)
        beginPan(e.touches[0].clientX, e.touches[0].clientY);
    },
    [beginPan],
  );

  const startTouchPan = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      if (e.evt.touches.length === 1) {
        beginPan(e.evt.touches[0].clientX, e.evt.touches[0].clientY);
      } else if (e.evt.touches.length > 1) {
        startPinch(
          e.evt.touches[0].clientX,
          e.evt.touches[0].clientY,
          e.evt.touches[1].clientX,
          e.evt.touches[1].clientY,
        );
      }

      window.addEventListener("touchmove", onTouchPanMove);
      window.addEventListener("touchend", onTouchPanEnd);

      stopListeners.current = () => {
        window.removeEventListener("touchmove", onTouchPanMove);
        window.removeEventListener("touchend", onTouchPanEnd);
      };
    },
    [beginPan, startPinch, onTouchPanMove, onTouchPanEnd],
  );

  useEffect(() => {
    return () => stopListeners.current();
  }, []);

  return { handleZoom, startPointerPan, startTouchPan, movePinch, endPinch };
};
