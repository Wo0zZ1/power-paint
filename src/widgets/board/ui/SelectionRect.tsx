import type Konva from "konva";
import type { RefObject } from "react";
import { Rect } from "react-konva";

interface SelectionRectProps {
  rectRef: RefObject<Konva.Rect | null>;
}

export function SelectionRect({ rectRef }: SelectionRectProps) {
  return (
    <Rect
      ref={rectRef}
      visible={false}
      fill="rgba(0, 0, 255, 0.1)"
      stroke="blue"
      strokeWidth={1}
      listening={false}
    />
  );
}
