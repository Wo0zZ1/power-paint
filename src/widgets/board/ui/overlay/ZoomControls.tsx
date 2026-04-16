"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { MAX_ZOOM, MIN_ZOOM, ZOOM_SENSITIVITY } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import {
  Button,
  ButtonGroup,
  Kbd,
  KbdGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";

import { useBoardStore, zoomTowardsPoint } from "../../model";

interface ZoomControlsProps {
  className?: string;
  tooltipActive?: boolean;
}

export function ZoomControls({
  className,
  tooltipActive = true,
}: ZoomControlsProps) {
  const t = useTranslations("toolbar.zoom");

  const viewportScale = useBoardStore(useShallow((s) => s.viewport.scale));
  const zoomPercent = Math.round(viewportScale * 100);

  const resetViewport = useCallback(() => {
    const { stage, viewport, updateViewport } = useBoardStore.getState();

    if (!stage) return;

    const newViewport = zoomTowardsPoint(
      stage.width() / 2,
      stage.height() / 2,
      viewport,
      1 / viewport.scale,
    );

    updateViewport(newViewport);
  }, []);

  const zoomIn = useCallback(() => {
    const { stage, viewport, updateViewport } = useBoardStore.getState();

    if (!stage) return;

    const newViewport = zoomTowardsPoint(
      stage.width() / 2,
      stage.height() / 2,
      viewport,
      ZOOM_SENSITIVITY,
    );

    updateViewport(newViewport);
  }, []);

  const zoomOut = useCallback(() => {
    const { stage, viewport, updateViewport } = useBoardStore.getState();

    if (!stage) return;

    const newViewport = zoomTowardsPoint(
      stage.width() / 2,
      stage.height() / 2,
      viewport,
      1 / ZOOM_SENSITIVITY,
    );

    updateViewport(newViewport);
  }, []);

  return (
    <ButtonGroup
      className={cn(
        "rounded-md bg-secondary/85 backdrop-blur-sm shadow-md",
        className,
      )}
    >
      <Tooltip open={tooltipActive ? undefined : false} disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={viewportScale <= MIN_ZOOM}
            className="not-dark:bg-transparent"
            onClick={zoomOut}
          >
            <Minus className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t("out")}{" "}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>-</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>

      <Tooltip open={tooltipActive ? undefined : false} disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="px-1 min-w-16 tabular-nums not-dark:bg-transparent"
            onClick={resetViewport}
          >
            {zoomPercent}%
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t("reset")}{" "}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>0</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>

      <Tooltip open={tooltipActive ? undefined : false} disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="not-dark:bg-transparent"
            disabled={viewportScale >= MAX_ZOOM}
            onClick={zoomIn}
          >
            <Plus className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t("in")}{" "}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>+</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
