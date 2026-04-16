import { MAX_ZOOM, MIN_ZOOM } from "@/shared/config";

import type { Viewport } from "../types";

export const screenToCanvas = (
  screenX: number,
  screenY: number,
  viewport: Viewport,
): [number, number] => {
  const canvasX = (screenX - viewport.x) / viewport.scale;
  const canvasY = (screenY - viewport.y) / viewport.scale;

  return [canvasX, canvasY];
};

export const canvasToScreen = (
  canvasX: number,
  canvasY: number,
  viewport: Viewport,
): [number, number] => {
  const screenX = canvasX * viewport.scale + viewport.x;
  const screenY = canvasY * viewport.scale + viewport.y;

  return [screenX, screenY];
};

export function zoomTowardsPoint(
  pointScreenX: number,
  pointScreenY: number,
  oldViewport: Viewport,
  scaleBy: number,
): Viewport {
  const newScale = Math.max(
    MIN_ZOOM,
    Math.min(MAX_ZOOM, oldViewport.scale * scaleBy),
  );

  const actualScaleBy = newScale / oldViewport.scale;

  return {
    x: pointScreenX * (1 - actualScaleBy) + oldViewport.x * actualScaleBy,
    y: pointScreenY * (1 - actualScaleBy) + oldViewport.y * actualScaleBy,
    scale: newScale,
  };
}
