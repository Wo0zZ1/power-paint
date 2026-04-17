import type Konva from "konva";
import type { RefObject } from "react";
import { Rect } from "react-konva";

interface SelectionElementProps {
  ref: RefObject<Konva.Rect | null>;
}

export function SelectionElement({ ref }: SelectionElementProps) {
  return (
    <Rect
      ref={ref}
      visible={false}
      fill="rgba(0, 0, 255, 0.1)"
      stroke="blue"
      strokeWidth={1}
      listening={false}
    />
  );
}
