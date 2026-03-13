"use client";

import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Circle } from "react-konva";

import type { CircleElement } from "../model/types";

interface CircleElementProps {
  element: CircleElement;
  onDragMove: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
}

export function CircleElement({ element, onDragMove }: CircleElementProps) {
  return (
    <Circle
      id={element.id}
      x={element.x}
      y={element.y}
      radius={element.radius!}
      fill="lightpink"
      draggable
      onDragMove={onDragMove}
    />
  );
}
