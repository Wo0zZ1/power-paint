import { useCallback } from "react";

import { generateId } from "../lib/generateId";

import type { CircleElementType, RectElementType } from "./types";
import { useBoardStore } from "./useBoardStore";

export const useAddElement = () => {
  const addElement = useBoardStore((s) => s.addElement);

  const addRect = useCallback(() => {
    addElement({
      id: generateId(),
      type: "rect",
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    } satisfies RectElementType);
  }, [addElement]);

  const addCircle = useCallback(() => {
    addElement({
      id: generateId(),
      type: "circle",
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      radius: 50,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    } satisfies CircleElementType);
  }, [addElement]);

  return { addRect, addCircle };
};
