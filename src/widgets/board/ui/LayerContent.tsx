"use client";

import type { ComponentProps } from "react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore } from "../model/useBoardStore";
import { useDragElements } from "../model/useDrag";

import { CircleElement } from "./CircleElement";
import { RectElement } from "./RectElement";
import { StrokeElement } from "./StrokeElement";
import { TextElement } from "./TextElement";

export function LayerContent() {
  const elements = useBoardStore(useShallow((s) => s.elements));
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));

  const { startPointerDrag, startTouchDrag } = useDragElements();

  const elementsList = useMemo(() => Array.from(elements.values()), [elements]);

  return (
    <>
      {elementsList.map((el) => {
        const commonProps = {
          isSelected: selectedIds.has(el.id),
          onPointerDown: startPointerDrag,
          onTouchStart: startTouchDrag,
        } satisfies Omit<ComponentProps<typeof RectElement>, "element">;

        switch (el.type) {
          case "rect":
            return <RectElement key={el.id} {...commonProps} element={el} />;
          case "circle":
            return <CircleElement key={el.id} {...commonProps} element={el} />;
          case "stroke":
            return <StrokeElement key={el.id} {...commonProps} element={el} />;
          case "text":
            return <TextElement key={el.id} {...commonProps} element={el} />;
          default:
            return null;
        }
      })}
    </>
  );
}
