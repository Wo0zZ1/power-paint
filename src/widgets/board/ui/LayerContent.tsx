"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore } from "../model/useBoardStore";
import { useDragElements } from "../model/useDrag";

import { CircleElement } from "./CircleElement";
import { RectElement } from "./RectElement";

export function LayerContent() {
  const elements = useBoardStore(useShallow((s) => s.elements));
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));

  const { startDrag } = useDragElements();

  const elementsList = useMemo(() => Array.from(elements.values()), [elements]);

  return (
    <>
      {elementsList.map((el) => {
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
