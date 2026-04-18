"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

import { useBoardStore, getElementsBounds, canvasToScreen } from "../../model";

export function BackToContentButton({ className }: { className?: string }) {
  const t = useTranslations("toolbar.zoom");

  const viewport = useBoardStore(useShallow((s) => s.viewport));
  const elements = useBoardStore(useShallow((s) => s.elements));

  let isVisible = false;
  const stage = useBoardStore.getState().stage;

  if (stage && elements.size > 0) {
    const bounds = getElementsBounds(Array.from(elements.values()));

    if (bounds) {
      const padding = 100;

      const [screenMinX, screenMinY] = canvasToScreen(
        bounds.minX,
        bounds.minY,
        viewport,
      );
      const [screenMaxX, screenMaxY] = canvasToScreen(
        bounds.maxX,
        bounds.maxY,
        viewport,
      );

      const stageWidth = stage.width();
      const stageHeight = stage.height();

      isVisible =
        screenMaxX < -padding ||
        screenMinX > stageWidth + padding ||
        screenMaxY < -padding ||
        screenMinY > stageHeight + padding;
    }
  }

  const fitToContent = useCallback(() => {
    const {
      stage,
      viewport,
      elements: currentElements,
      updateViewport,
    } = useBoardStore.getState();
    if (!stage) return;

    const bounds = getElementsBounds(Array.from(currentElements.values()));
    if (!bounds) return;

    const boxWidth = bounds.maxX - bounds.minX;
    const boxHeight = bounds.maxY - bounds.minY;

    const newX =
      stage.width() / 2 - (bounds.minX + boxWidth / 2) * viewport.scale;
    const newY =
      stage.height() / 2 - (bounds.minY + boxHeight / 2) * viewport.scale;

    updateViewport({
      x: newX,
      y: newY,
      scale: viewport.scale,
    });
  }, []);

  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="default"
      onClick={fitToContent}
      className={cn(
        "rounded-full bg-secondary/85 not-dark:bg-secondary/85 backdrop-blur-sm shadow-md",
        className,
      )}
    >
      <MapPin className="size-4" />
      {t("fit")}
    </Button>
  );
}
