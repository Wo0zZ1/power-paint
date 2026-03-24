"use client";

import type { BaseElementProps, ElementType } from "../../model";
import { useDragElements } from "../../model";

import { CircleElement } from "./CircleElement";
import { DrawElement } from "./DrawElement";
import { RectElement } from "./RectElement";
import { TextElement } from "./TextElement";

interface ElementProps {
  element: ElementType;
}

export function Element({ element }: ElementProps) {
  const { startPointerDrag, startTouchDrag } = useDragElements();

  const commonProps = {
    onPointerDown: startPointerDrag,
    onTouchStart: startTouchDrag,
  } satisfies BaseElementProps;

  switch (element.type) {
    case "rect":
      return (
        <RectElement key={element.id} {...commonProps} element={element} />
      );
    case "circle":
      return (
        <CircleElement key={element.id} {...commonProps} element={element} />
      );
    case "draw":
      return (
        <DrawElement key={element.id} {...commonProps} element={element} />
      );
    case "text":
      return (
        <TextElement key={element.id} {...commonProps} element={element} />
      );
    default:
      const _: never = element;
      return _;
  }
}
