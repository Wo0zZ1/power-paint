import type Konva from "konva";
import type { RefObject } from "react";
import { Line } from "react-konva";

interface EraserElementProps {
  ref: RefObject<Konva.Line | null>;
}

export function EraserElement({ ref }: EraserElementProps) {
  return (
    <Line
      ref={ref}
      visible={false}
      stroke="rgba(255, 255, 255, 0.25)"
      strokeWidth={8}
      lineCap="round"
      lineJoin="round"
      listening={false}
      tension={0.5}
      globalCompositeOperation="source-over"
    />
  );
}
