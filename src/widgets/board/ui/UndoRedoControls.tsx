"use client";

import { Redo2, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";

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

import { useBoardStore } from "../model/useBoardStore";

interface UndoRedoControlsProps {
  className?: string;
  tooltipActive?: boolean;
}

export function UndoRedoControls({
  className,
  tooltipActive = true,
}: UndoRedoControlsProps) {
  const t = useTranslations("toolbar.history");

  const undo = useBoardStore((s) => s.undo);
  const redo = useBoardStore((s) => s.redo);

  const canUndo = useBoardStore((s) => s.canUndo);
  const canRedo = useBoardStore((s) => s.canRedo);

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
            disabled={!canUndo}
            onClick={undo}
            className="not-dark:bg-transparent"
          >
            <Undo2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {t("undo")}{" "}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Z</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>

      <Tooltip open={tooltipActive ? undefined : false} disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={!canRedo}
            onClick={redo}
            className="not-dark:bg-transparent"
          >
            <Redo2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {t("redo")}{" "}
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>Z</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
