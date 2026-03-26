import type { ComponentProps } from "react";
import { Ellipse } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useInvertableColor } from "@/shared/lib/hooks";

import type { CircleElementType } from "../../model";
import {
  useBoardStore,
  getCirclePoints,
  getDash,
  getFillPriority,
  getCircleOffset,
  getOpacity,
} from "../../model";

type CircleElementProps = {
  element: CircleElementType;
  canEdit: boolean;
} & Omit<ComponentProps<typeof Ellipse>, "radiusX" | "radiusY">;

export function CircleElement({ element, ...props }: CircleElementProps) {
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore((s) => s.selectionType);
  const isSelected = selectedIds.has(element.id);

  const { startPoint, endPoint, fillRadialGradientEndRadius } =
    getCirclePoints(element);

  const dash = getDash(element.strokeType);

  const fillPriority = getFillPriority(
    element.fillType,
    element.fillGradientType,
  );

  const offset = getCircleOffset(element);

  const opacity = getOpacity(element.opacity, isSelected, selectionType);

  const { activeColor: fillColor1 } = useInvertableColor(element.fillColor1);
  const { activeColor: fillColor2 } = useInvertableColor(element.fillColor2);
  const { activeColor: strokeColor } = useInvertableColor(element.strokeColor);

  return (
    <Ellipse
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      radiusX={element.width / 2}
      radiusY={element.height / 2}
      offset={offset}
      rotation={element.rotation}
      opacity={opacity}
      // Fill
      fill={fillColor1}
      fillPriority={fillPriority}
      fillEnabled={element.fillType !== "none"}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={fillRadialGradientEndRadius}
      fillLinearGradientStartPoint={startPoint}
      fillLinearGradientEndPoint={endPoint}
      fillLinearGradientColorStops={[0, fillColor1, 1, fillColor2]}
      fillRadialGradientColorStops={[0, fillColor1, 1, fillColor2]}
      // Stroke
      hitStrokeWidth={22}
      strokeScaleEnabled={false}
      fillAfterStrokeEnabled={true}
      stroke={strokeColor}
      strokeWidth={element.strokeWidth}
      dash={dash}
      // Others
      {...props}
    />
  );
}
