import type Konva from "konva";
import type { RefObject } from "react";
import { Rect } from "react-konva";

interface SelectionElementProps {
  rectRef: RefObject<Konva.Rect | null>;
}

export function SelectionElement({ rectRef }: SelectionElementProps) {
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
