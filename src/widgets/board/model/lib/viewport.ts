import { MAX_ZOOM, MIN_ZOOM } from "@/shared/constants";

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

export function getFitViewport(
  stageWidth: number,
  stageHeight: number,
  box: { minX: number; minY: number; maxX: number; maxY: number } | null,
): Viewport {
  if (!box) return { x: stageWidth / 2, y: stageHeight / 2, scale: 1 };

  const padding = 100;
  const boxWidth = box.maxX - box.minX;
  const boxHeight = box.maxY - box.minY;

  let newScale = Math.min(
    (stageWidth - padding * 2) / boxWidth,
    (stageHeight - padding * 2) / boxHeight,
    1,
  );

  newScale = Math.max(MIN_ZOOM, Math.min(newScale, MAX_ZOOM));

  const newX = stageWidth / 2 - (box.minX + boxWidth / 2) * newScale;
  const newY = stageHeight / 2 - (box.minY + boxHeight / 2) * newScale;

  return { x: newX, y: newY, scale: newScale };
}
