import type { Vector2d } from "konva/lib/types";
import type { ComponentProps } from "react";
import { Circle } from "react-konva";

import { useTheme, getSystemTheme } from "@/features/theme-switcher";
import {
  degToRad,
  invertHexColor,
} from "@/shared/lib/utils";

import { getDash, getFillPriority } from "../lib/utils";
import type { CircleElementType } from "../model/types";

type CircleElementProps = {
  element: CircleElementType;
  isSelected?: boolean;
} & ComponentProps<typeof Circle>;

export function CircleElement({ element, ...props }: CircleElementProps) {
  const fillPriority = getFillPriority(element.fillType, element.gradientType);
  const dash = getDash(element.strokeType);

  // Вычисляем точки градиента для круга
  let startPoint: Vector2d | undefined;
  let endPoint: Vector2d | undefined;

  if (fillPriority === "linear-gradient") {
    const angle = degToRad(element.fillAngle);
    startPoint = {
      x: -element.radius * Math.cos(angle),
      y: element.radius * Math.sin(angle),
    };
    endPoint = {
      x: element.radius * Math.cos(angle),
      y: -element.radius * Math.sin(angle),
    };
  } else if (fillPriority === "radial-gradient") {
  }

  const { themePreference } = useTheme();
  const resolvedTheme =
    themePreference === "system" ? getSystemTheme() : themePreference;

  return (
    <Circle
      id={element.id}
      x={element.x}
      y={element.y}
      radius={element.radius}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      opacity={element.opacity}
      // Fill
      fill={
        resolvedTheme === "dark"
          ? invertHexColor(element.fillColor1)
          : element.fillColor1
      }
      fillPriority={fillPriority}
      fillEnabled={!!element.fillType}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={element.radius}
      fillLinearGradientStartPoint={startPoint}
      fillLinearGradientEndPoint={endPoint}
      fillLinearGradientColorStops={[
        0,
        resolvedTheme === "dark"
          ? invertHexColor(element.fillColor1)
          : element.fillColor1,
        1,
        resolvedTheme === "dark"
          ? invertHexColor(element.fillColor2)
          : element.fillColor2,
      ]}
      fillRadialGradientColorStops={[
        0,
        resolvedTheme === "dark"
          ? invertHexColor(element.fillColor1)
          : element.fillColor1,
        1,
        resolvedTheme === "dark"
          ? invertHexColor(element.fillColor2)
          : element.fillColor2,
      ]}
      // Stroke
      fillAfterStrokeEnabled={true}
      stroke={
        resolvedTheme === "dark"
          ? invertHexColor(element.strokeColor)
          : element.strokeColor
      }
      strokeWidth={element.strokeWidth}
      dash={dash}
      // Others
      {...props}
    />
  );
}
