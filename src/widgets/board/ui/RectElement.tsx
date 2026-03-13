import type { ComponentProps } from "react";
import { Rect } from "react-konva";

import type { RectElementType } from "../model/element/types";

type RectElementProps = {
  element: RectElementType;
  isSelected?: boolean;
} & ComponentProps<typeof Rect>;

export function RectElement({
  element,
  isSelected,
  ...props
}: RectElementProps) {
  return (
    <Rect
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      //
      fill="lightblue"
      stroke={isSelected ? "blue" : undefined}
      strokeWidth={isSelected ? 2 : 0}
      {...props}
    />
  );
}
