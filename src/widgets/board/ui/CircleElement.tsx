import type { ComponentProps } from "react";
import { Circle } from "react-konva";

import type { CircleElementType } from "../model/element/types";

type CircleElementProps = {
  element: CircleElementType;
  isSelected?: boolean;
} & ComponentProps<typeof Circle>;

export function CircleElement({
  element,
  isSelected,
  ...props
}: CircleElementProps) {
  return (
    <Circle
      id={element.id}
      x={element.x}
      y={element.y}
      radius={element.radius}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      //
      fill="lightpink"
      stroke={isSelected ? "blue" : undefined}
      strokeWidth={isSelected ? 2 : 0}
      {...props}
    />
  );
}
