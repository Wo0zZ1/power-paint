import { interpolate } from "motion/react";

import type { Tool } from "@/shared/constants";
import { useInvertableColor } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";

const FILLABLE_TOOLS: Tool[] = ["rect", "circle"];
const STROKABLE_TOOLS: Tool[] = ["rect", "circle", "draw"];

export const useToolMenu = () => {
  const currentStrokeColor = useBoardStore((s) => s.currentStrokeColor);
  const setCurrentStrokeColor = useBoardStore((s) => s.setCurrentStrokeColor);
  const currentStrokeWidth = useBoardStore((s) => s.currentStrokeWidth);
  const setCurrentStrokeWidth = useBoardStore((s) => s.setCurrentStrokeWidth);
  const currentFillEnabled = useBoardStore((s) => s.currentFillEnabled);
  const setCurrentFillEnabled = useBoardStore((s) => s.setCurrentFillEnabled);
  const currentFillColor = useBoardStore((s) => s.currentFillColor);
  const setCurrentFillColor = useBoardStore((s) => s.setCurrentFillColor);
  const tool = useBoardStore((s) => s.tool);

  const shouldShowStrokeButton = STROKABLE_TOOLS.includes(tool);
  const shouldShowFillButton = FILLABLE_TOOLS.includes(tool);

  const { activeColor: currentStrokeColorInverted } =
    useInvertableColor(currentStrokeColor);

  const strokePreviewWidth = interpolate([4, 50], [1.5, 5])(currentStrokeWidth);

  return {
    currentStrokeColor,
    setCurrentStrokeColor,
    currentStrokeWidth,
    setCurrentStrokeWidth,
    currentFillEnabled,
    setCurrentFillEnabled,
    currentFillColor,
    setCurrentFillColor,
    shouldShowStrokeButton,
    shouldShowFillButton,
    currentStrokeColorInverted,
    strokePreviewWidth,
  };
};
