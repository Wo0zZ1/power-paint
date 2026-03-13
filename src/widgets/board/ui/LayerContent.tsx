"use client";

import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";

import type { Element } from "../model/types";

import { CircleElement } from "./CircleElement";
import { RectElement } from "./RectElement";

interface LayerContentProps {
  elements?: Element[];
  handleDrag: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
}

export function LayerContent({ elements, handleDrag }: LayerContentProps) {
  return (
    <>
      {elements?.map((el) => {
        if (el.type === "rect") {
          return (
            <RectElement key={el.id} element={el} onDragMove={handleDrag} />
          );
        }
        if (el.type === "circle") {
          return (
            <CircleElement key={el.id} element={el} onDragMove={handleDrag} />
          );
        }
        return null;
      })}
    </>
  );
}
