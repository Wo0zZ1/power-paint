import type { ComponentProps } from "react";
import { Line } from "react-konva";

import { useTheme, getSystemTheme } from "@/features/theme-switcher";
import { invertHexColor } from "@/shared/lib/utils";

import { getDash } from "../lib/utils";
import type { StrokeElementType } from "../model/types";

type StrokeElementProps = {
  element: StrokeElementType;
  isSelected?: boolean;
} & ComponentProps<typeof Line>;

export function StrokeElement({ element, ...props }: StrokeElementProps) {
  const dash = getDash(element.strokeType);

  const { themePreference } = useTheme();
  const resolvedTheme =
    themePreference === "system" ? getSystemTheme() : themePreference;

  return (
    <Line
      id={element.id}
      x={element.x}
      y={element.y}
      points={element.points}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      opacity={element.opacity}
      lineCap="round"
      lineJoin="round"
      tension={0.5}
      // Stroke
      dash={dash}
      hitStrokeWidth={16}
      strokeScaleEnabled={true}
      stroke={
        resolvedTheme === "dark"
          ? invertHexColor(element.strokeColor)
          : element.strokeColor
      }
      strokeWidth={element.strokeWidth}
      {...props}
    />
  );
}
