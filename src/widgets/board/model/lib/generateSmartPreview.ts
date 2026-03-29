import type Konva from "konva";
import type { Layer } from "konva/lib/Layer";

import type { Theme } from "@/shared/lib/theme";
import { invertColor } from "@/shared/lib/utils/color";

const tryInvert = (color: string): string => {
  try {
    return invertColor(color);
  } catch {
    return color;
  }
};

const createInvertedLayer = (layer: Layer): Layer => {
  const clone = layer.clone({ listening: false });

  const shapes = clone.find("Shape") as Array<Konva.Shape>;
  shapes.forEach((shape) => {
    const currentFill = shape.fill?.();
    const currentStroke = shape.stroke?.();

    if (typeof currentFill === "string") {
      shape.fill?.(tryInvert(currentFill));
    }

    if (typeof currentStroke === "string") {
      shape.stroke?.(tryInvert(currentStroke));
    }
  });

  return clone;
};

export const generateSmartPreview = (
  layer: Layer,
  invert: boolean = true,
): string | null => {
  const sourceLayer = invert ? createInvertedLayer(layer) : layer;

  // 1. Находим все фигуры на доске
  const shapes = sourceLayer.find("Shape");

  if (shapes.length === 0) {
    if (invert) sourceLayer.destroy();
    return null;
  }

  // 2. Находим bounding box всего контента
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  shapes.forEach((shape) => {
    const box = shape.getClientRect();

    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  });

  // 3. Вычисляем оптимальные параметры для preview
  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const padding = 20;
  const previewWidth = 320;
  const previewHeight = 180;

  if (
    contentWidth <= 0 ||
    contentHeight <= 0 ||
    !Number.isFinite(contentWidth) ||
    !Number.isFinite(contentHeight)
  ) {
    if (invert) sourceLayer.destroy();
    return null;
  }

  const scale = Math.min(
    (previewWidth - padding * 2) / contentWidth,
    (previewHeight - padding * 2) / contentHeight,
  );

  const scaledContentWidth = contentWidth * scale;
  const scaledContentHeight = contentHeight * scale;
  const marginX = (previewWidth - scaledContentWidth) / 2;
  const marginY = (previewHeight - scaledContentHeight) / 2;

  const cropX = minX - marginX / scale;
  const cropY = minY - marginY / scale;
  const cropWidth = previewWidth / scale;
  const cropHeight = previewHeight / scale;

  try {
    const dataURL = sourceLayer.toDataURL({
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
      pixelRatio: scale,
      mimeType: "image/png",
    });

    if (invert) sourceLayer.destroy();
    return dataURL;
  } catch (error) {
    console.error("useBoardPreview: failed to generate preview", error);
    if (invert) sourceLayer.destroy();
    return null;
  }
};

export const generateBothPreviews = (
  layer: Layer,
  currentTheme: Exclude<Theme, "system">,
) => {
  const lightPreview = generateSmartPreview(
    layer,
    currentTheme === "dark" ? true : false,
  );
  const darkPreview = generateSmartPreview(
    layer,
    currentTheme === "light" ? true : false,
  );

  return { lightPreview, darkPreview };
};
