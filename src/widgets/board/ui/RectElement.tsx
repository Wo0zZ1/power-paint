import type { ComponentProps } from "react";
import { Rect } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useInvertableColor } from "@/shared/lib/hooks";

import {
  getDash,
  getFillPriority,
  getOpacity,
  getRectPoints,
} from "../lib/utils";
import type { RectElementType } from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

type RectElementProps = {
  element: RectElementType;
} & ComponentProps<typeof Rect>;

export function RectElement({ element, ...props }: RectElementProps) {
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore((s) => s.selectionType);
  const isSelected = selectedIds.has(element.id);

  const { startPoint, endPoint, centerPoint, fillRadialGradientEndRadius } =
    getRectPoints(element);

  const dash = getDash(element.strokeType);

  const fillPriority = getFillPriority(
    element.fillType,
    element.fillGradientType,
  );

  const opacity = getOpacity(element.opacity, isSelected, selectionType);

  const { activeColor: fillColor1 } = useInvertableColor(element.fillColor1);
  const { activeColor: fillColor2 } = useInvertableColor(element.fillColor2);
  const { activeColor: strokeColor } = useInvertableColor(element.strokeColor);

  return (
    <Rect
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      opacity={opacity}
      // Fill
      fill={fillColor1}
      fillPriority={fillPriority}
      fillEnabled={element.fillType !== "none"}
      fillLinearGradientStartPoint={startPoint}
      fillLinearGradientEndPoint={endPoint}
      fillLinearGradientColorStops={[0, fillColor1, 1, fillColor2]}
      fillRadialGradientStartPoint={centerPoint}
      fillRadialGradientEndPoint={centerPoint}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={fillRadialGradientEndRadius}
      fillRadialGradientColorStops={[0, fillColor1, 1, fillColor2]}
      // Stroke
      hitStrokeWidth={22}
      strokeScaleEnabled={true}
      fillAfterStrokeEnabled={true}
      stroke={strokeColor}
      strokeWidth={element.strokeWidth}
      dash={dash}
      // Others
      {...props}
    />
  );
}
