"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore } from "../model/useBoardStore";

import { Element } from "./Element";

export function LayerContent() {
  const elements = useBoardStore(useShallow((s) => s.elements));
  const elementsList = useMemo(() => Array.from(elements.values()), [elements]);

  return elementsList.map((el) => <Element key={el.id} element={el} />);
}
