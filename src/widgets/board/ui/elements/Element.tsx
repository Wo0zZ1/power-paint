"use client";

import type { BaseElementProps, ElementType } from "../../model";
import { useDragElements } from "../../model";

import { CircleElement } from "./CircleElement";
import { DrawElement } from "./DrawElement";
import { RectElement } from "./RectElement";
import { TextElement } from "./TextElement";

interface ElementProps {
  element: ElementType;
  canEdit: boolean;
}

export function Element({ element, canEdit }: ElementProps) {
  const { startPointerDrag, startTouchDrag } = useDragElements({ canEdit });

  const commonProps = {
    onPointerDown: startPointerDrag,
    onTouchStart: startTouchDrag,
  } satisfies BaseElementProps;

  switch (element.type) {
    case "rect":
      return (
        <RectElement
          key={element.id}
          {...commonProps}
          element={element}
          canEdit={canEdit}
        />
      );
    case "circle":
      return (
        <CircleElement
          key={element.id}
          {...commonProps}
          element={element}
          canEdit={canEdit}
        />
      );
    case "draw":
      return (
        <DrawElement
          key={element.id}
          {...commonProps}
          element={element}
          canEdit={canEdit}
        />
      );
    case "text":
      return (
        <TextElement
          key={element.id}
          {...commonProps}
          element={element}
          canEdit={canEdit}
        />
      );
    default:
      const _: never = element;
      return _;
  }
}
