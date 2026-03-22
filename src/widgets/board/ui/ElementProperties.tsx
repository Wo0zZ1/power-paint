"use client";

import { useShallow } from "zustand/react/shallow";

import { Separator } from "@/shared/ui";

import { useThrottledCallback } from "../lib/useThrottledCallback";
import { type ElementType } from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

import {
  AppearanceSection,
  FillSection,
  PositionSection,
  RotationSection,
  SizeSection,
  StrokeSection,
  TextSection,
} from "./properties";

export function ElementProperties() {
  const selectedElementIds = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore((s) => s.selectionType);
  const elements = useBoardStore(useShallow((s) => s.elements));

  const selectedElements = Array.from(selectedElementIds)
    .map((id) => elements.get(id))
    .filter((el): el is ElementType => el !== undefined);

  const updateElements = useBoardStore((s) => s.updateElements);

  const update = useThrottledCallback(
    <T extends ElementType>(change: Partial<T> | ((prev: T) => Partial<T>)) => {
      const changes = new Map<string, Partial<ElementType>>();

      for (const element of selectedElements) {
        changes.set(
          element.id,
          change instanceof Function ? change(element as T) : change,
        );
      }

      updateElements(changes);
    },
  );

  if (selectionType !== "transform" || selectedElements.length === 0)
    return null;

  return (
    <>
      <Separator />

      <PositionSection elements={selectedElements} update={update} />
      <SizeSection elements={selectedElements} update={update} />
      <RotationSection elements={selectedElements} update={update} />
      <AppearanceSection elements={selectedElements} update={update} />
      <FillSection elements={selectedElements} update={update} />
      <StrokeSection elements={selectedElements} update={update} />
      <TextSection elements={selectedElements} update={update} />
    </>
  );
}
