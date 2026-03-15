import type { Vector2d } from "konva/lib/types";
import type { ComponentProps } from "react";
import { Rect } from "react-konva";

import { useInvertableColor } from "@/shared/lib/hooks";
import { degToRad } from "@/shared/lib/utils";

import { getDash, getFillPriority } from "../lib/utils";
import type { RectElementType } from "../model/types";

type RectElementProps = {
  element: RectElementType;
  isSelected?: boolean;
} & ComponentProps<typeof Rect>;

export function RectElement({ element, ...props }: RectElementProps) {
  const fillPriority = getFillPriority(element.fillType, element.gradientType);
  const dash = getDash(element.strokeType);
  const angle = degToRad(element.fillAngle);

  const centerPoint: Vector2d = {
    x: element.width / 2,
    y: element.height / 2,
  };

  // Получаем 4 угла прямоугольника (относительно центра)
  const corners = [
    { x: -element.width / 2, y: -element.height / 2 },
    { x: element.width / 2, y: -element.height / 2 },
    { x: -element.width / 2, y: element.height / 2 },
    { x: element.width / 2, y: element.height / 2 },
  ];

  // Находим проекции углов на направление градиента
  const projections = corners.map(
    (corner) => corner.x * Math.cos(angle) + corner.y * Math.sin(angle),
  );

  const minProjection = Math.min(...projections);
  const maxProjection = Math.max(...projections);

  // Вычисляем стартовую и конечную точки градиента
  const startPoint: Vector2d = {
    x: centerPoint.x + minProjection * Math.cos(angle),
    y: centerPoint.y - minProjection * Math.sin(angle),
  };

  const endPoint: Vector2d = {
    x: centerPoint.x + maxProjection * Math.cos(angle),
    y: centerPoint.y - maxProjection * Math.sin(angle),
  };

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
      opacity={element.opacity}
      // Fill
      fill={fillColor1}
      fillPriority={fillPriority}
      fillEnabled={!!element.fillType}
      fillLinearGradientStartPoint={startPoint}
      fillLinearGradientEndPoint={endPoint}
      fillLinearGradientColorStops={[0, fillColor1, 1, fillColor2]}
      fillRadialGradientStartPoint={centerPoint}
      fillRadialGradientEndPoint={centerPoint}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={Math.sqrt(
        (element.width / 2) ** 2 + (element.height / 2) ** 2,
      )}
      fillRadialGradientColorStops={[0, fillColor1, 1, fillColor2]}
      // Stroke
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
