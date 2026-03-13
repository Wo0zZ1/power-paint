import { useCallback } from "react";

import { createCircle, createRect } from "./types";
import { useBoardStore } from "./useBoardStore";

export const useAddElement = () => {
  const addElement = useBoardStore((s) => s.addElement);

  const addRect = useCallback(() => {
    addElement(createRect());
  }, [addElement]);

  const addCircle = useCallback(() => {
    addElement(createCircle());
  }, [addElement]);

  return { addRect, addCircle };
};
