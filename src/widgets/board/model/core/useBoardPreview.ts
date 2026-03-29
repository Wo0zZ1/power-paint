"use client";

import type { Layer } from "konva/lib/Layer";
import type { RefObject } from "react";
import { useEffect } from "react";

import { updateBoardPreviewAction } from "../actions";

interface UseBoardPreviewProps {
  ref: RefObject<Layer | null>;
  boardId: string;
}

export const useBoardPreview = ({ ref, boardId }: UseBoardPreviewProps) => {
  const generateSmartPreview = (layer: Layer) => {
    // 1. Находим все фигуры на доске
    const shapes = layer.find("Shape");

    if (shapes.length === 0) return null;

    // 2. Находим bounding box всего контента
    let minX = +Infinity,
      minY = +Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;

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
      return null;
    }

    // 4. Приводим контент к размеру превью (с запасом padding)
    const scale = Math.min(
      (previewWidth - padding * 2) / contentWidth,
      (previewHeight - padding * 2) / contentHeight,
    );

    const scaledContentWidth = contentWidth * scale;
    const scaledContentHeight = contentHeight * scale;
    const marginX = (previewWidth - scaledContentWidth) / 2;
    const marginY = (previewHeight - scaledContentHeight) / 2;

    // 5. Вычисляем область для экспорта без изменения состояния реального слоя
    const cropX = minX - marginX / scale;
    const cropY = minY - marginY / scale;
    const cropWidth = previewWidth / scale;
    const cropHeight = previewHeight / scale;

    try {
      const dataURL = layer.toDataURL({
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
        pixelRatio: scale,
        mimeType: "image/png",
      });

      return dataURL;
    } catch (error) {
      console.error("useBoardPreview: failed to generate preview", error);
      return null;
    }
  };

  useEffect(() => {
    const sendPreview = async () => {
      const layer = ref.current;
      if (!layer) return;

      const smartPreview = generateSmartPreview(layer);

      if (!smartPreview) return;

      await updateBoardPreviewAction(boardId, smartPreview);
    };

    const intervalId = setInterval(sendPreview, 5 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [ref, boardId]);
};
