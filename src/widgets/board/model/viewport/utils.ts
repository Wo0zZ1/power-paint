import type { Viewport } from "./types";

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

export function zoomTowardsMouse(
  mouseScreenX: number,
  mouseScreenY: number,
  oldViewport: Viewport,
  scaleBy: number,
): Viewport {
  const newScale = Math.max(0.1, Math.min(5, oldViewport.scale * scaleBy));

  return {
    x: mouseScreenX * (1 - scaleBy) + oldViewport.x * scaleBy,
    y: mouseScreenY * (1 - scaleBy) + oldViewport.y * scaleBy,
    scale: newScale,
  };
}
