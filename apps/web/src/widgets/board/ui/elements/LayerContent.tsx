"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore } from "../../model";

import { Element } from "./Element";

interface LayerContentProps {
  canEdit: boolean;
}

export function LayerContent({ canEdit }: LayerContentProps) {
  const elements = useBoardStore(useShallow((s) => s.elements));
  const elementsList = useMemo(
    () =>
      Array.from(elements.values()).sort(
        (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0),
      ),
    [elements],
  );

  return elementsList.map((el) => (
    <Element key={el.id} element={el} canEdit={canEdit} />
  ));
}
