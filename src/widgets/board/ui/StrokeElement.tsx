import type { ComponentProps } from "react";
import { Line } from "react-konva";

import type { StrokeElementType } from "../model/types";

type StrokeElementProps = {
  element: StrokeElementType;
  isSelected?: boolean;
} & ComponentProps<typeof Line>;

export function StrokeElement({
  element,
  isSelected,
  ...props
}: StrokeElementProps) {
  return (
    <Line
      id={element.id}
      x={element.x}
      y={element.y}
      points={element.points}
      stroke={element.color}
      strokeScaleEnabled={false}
      strokeWidth={element.strokeWidth}
      hitStrokeWidth={16}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      lineCap="round"
      lineJoin="round"
      tension={0.5}
      //
      shadowColor="blue"
      shadowBlur={1}
      shadowOpacity={0.25}
      shadowEnabled={isSelected}
      {...props}
    />
  );
}
