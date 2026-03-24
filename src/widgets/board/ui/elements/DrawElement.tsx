import type { ComponentProps } from "react";
import { Line } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useInvertableColor } from "@/shared/lib/hooks";

import type { DrawElementType } from "../../model";
import { useBoardStore, getDash, getOpacity } from "../../model";

type DrawElementProps = {
  element: DrawElementType;
  isSelected?: boolean;
} & ComponentProps<typeof Line>;

export function DrawElement({ element, ...props }: DrawElementProps) {
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore((s) => s.selectionType);
  const isSelected = selectedIds.has(element.id);

  const dash = getDash(element.strokeType);

  const opacity = getOpacity(element.opacity, isSelected, selectionType);

  const { activeColor: strokeColor } = useInvertableColor(element.strokeColor);

  return (
    <Line
      id={element.id}
      x={element.x}
      y={element.y}
      points={element.points}
      rotation={element.rotation}
      opacity={opacity}
      lineCap="round"
      lineJoin="round"
      tension={0.5}
      // Stroke
      dash={dash}
      hitStrokeWidth={22}
      strokeScaleEnabled={true}
      stroke={strokeColor}
      strokeWidth={element.strokeWidth}
      {...props}
    />
  );
}
