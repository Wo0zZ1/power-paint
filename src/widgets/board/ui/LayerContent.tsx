"use client";

import { useBoardStore } from "../model/useBoardStore";
import { useDragElements } from "../model/useDrag";

import { CircleElement } from "./CircleElement";
import { RectElement } from "./RectElement";

export function LayerContent() {
  const elements = useBoardStore((s) => s.elements);
  const selectedIds = useBoardStore((s) => s.selectedIds);

  const { startDrag } = useDragElements();

  return (
    <>
      {Array.from(elements.values()).map((el) => {
        const commonProps = {
          isSelected: selectedIds.has(el.id),
          onMouseDown: startDrag,
        };

        switch (el.type) {
          case "rect":
            return <RectElement key={el.id} {...commonProps} element={el} />;
          case "circle":
            return <CircleElement key={el.id} {...commonProps} element={el} />;
          default:
            return null;
        }
      })}
    </>
  );
}
