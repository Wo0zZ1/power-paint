import type Konva from "konva";
import type { RefObject } from "react";
import { Rect } from "react-konva";

import { useBoardStore } from "../../model";

interface SelectionElementProps {
  ref: RefObject<Konva.Rect | null>;
}

export function SelectionElement({ ref }: SelectionElementProps) {
  const viewportScale = useBoardStore((s) => s.viewport.scale);

  return (
    <Rect
      ref={ref}
      visible={false}
      fill="rgba(180, 176, 255, 0.15)"
      stroke="#B4B0FF"
      strokeWidth={0.5 / viewportScale}
      listening={false}
    />
  );
}
