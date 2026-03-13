import type { RefObject } from "react";
import { useCallback } from "react";
import type { Array } from "yjs";

import type { Element } from "./types";

interface useAddElementProps {
  elementsRef: RefObject<Array<Element> | null>;
}

export const useAddElement = ({ elementsRef }: useAddElementProps) => {
  const addRect = useCallback(() => {
    elementsRef.current?.push([
      {
        id: crypto.randomUUID(),
        type: "rect",
        x: 50 + Math.random() * 300,
        y: 50 + Math.random() * 200,
        width: 100,
        height: 80,
      },
    ]);
  }, [elementsRef]);

  const addCircle = useCallback(() => {
    elementsRef.current?.push([
      {
        id: crypto.randomUUID(),
        type: "circle",
        x: 50 + Math.random() * 300,
        y: 50 + Math.random() * 200,
        radius: 50,
      },
    ]);
  }, [elementsRef]);

  return { addRect, addCircle };
};
