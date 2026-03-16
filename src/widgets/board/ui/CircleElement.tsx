import type { Vector2d } from "konva/lib/types";
import type { ComponentProps } from "react";
import { Ellipse } from "react-konva";

import { useInvertableColor } from "@/shared/lib/hooks";
import { degToRad } from "@/shared/lib/utils";

import { getDash, getFillPriority } from "../lib/utils";
import type { CircleElementType } from "../model/types";

type CircleElementProps = {
  element: CircleElementType;
  isSelected?: boolean;
} & Omit<ComponentProps<typeof Ellipse>, "radiusX" | "radiusY">;

export function CircleElement({ element, ...props }: CircleElementProps) {
  const fillPriority = getFillPriority(element.fillType, element.fillGradientType);
  const dash = getDash(element.strokeType);

  // Вычисляем точки градиента
  let startPoint: Vector2d | undefined;
  let endPoint: Vector2d | undefined;

  if (fillPriority === "linear-gradient") {
    const angle = degToRad(element.fillAngle);
    startPoint = {
      x: -(element.width / 2) * Math.cos(angle),
      y: (element.height / 2) * Math.sin(angle),
    };
    endPoint = {
      x: (element.width / 2) * Math.cos(angle),
      y: -(element.height / 2) * Math.sin(angle),
    };
  } else if (fillPriority === "radial-gradient") {
  }

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
      offset={{
        x: -(element.width / 2),
        y: -(element.height / 2),
      }}
      rotation={element.rotation}
      opacity={element.opacity}
      // Fill
      fill={fillColor1}
      fillPriority={fillPriority}
      fillEnabled={element.fillType !== "none"}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={Math.max(element.width, element.height) / 2}
      fillLinearGradientStartPoint={startPoint}
      fillLinearGradientEndPoint={endPoint}
      fillLinearGradientColorStops={[0, fillColor1, 1, fillColor2]}
      fillRadialGradientColorStops={[0, fillColor1, 1, fillColor2]}
      // Stroke
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
