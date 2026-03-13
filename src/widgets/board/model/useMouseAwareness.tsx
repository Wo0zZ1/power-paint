import type { MouseEvent, RefObject } from "react";
import { useCallback } from "react";

import { useBoardStore } from "./useBoardStore";

export const useMouseAwareness = (
  boardRef: RefObject<HTMLDivElement | null>,
) => {
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      useBoardStore.getState().provider?.setAwarenessField("cursor", {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [boardRef],
  );

  const handleMouseLeave = useCallback(() => {
    useBoardStore.getState().provider?.setAwarenessField("cursor", null);
  }, []);

  return { handleMouseMove, handleMouseLeave };
};
