"use client";

import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Rect } from "react-konva";

import type { RectElement } from "../model/types";

interface RectElementProps {
  element: RectElement;
  onDragMove: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
}

export function RectElement({ element, onDragMove }: RectElementProps) {
  return (
    <Rect
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      fill="lightblue"
      draggable
      onDragMove={onDragMove}
    />
  );
}
