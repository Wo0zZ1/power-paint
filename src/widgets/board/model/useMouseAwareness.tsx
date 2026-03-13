import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { MouseEvent, RefObject } from "react";
import { useCallback } from "react";

interface useMouseAwarenessProps {
  boardRef: RefObject<HTMLDivElement | null>;
  providerRef: RefObject<HocuspocusProvider | null>;
}

export const useMouseAwareness = ({
  boardRef,
  providerRef,
}: useMouseAwarenessProps) => {
  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      providerRef.current?.setAwarenessField("cursor", {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [boardRef, providerRef],
  );

  const handleMouseLeave = useCallback(() => {
    providerRef.current?.setAwarenessField("cursor", null);
  }, [providerRef]);

  return { handleMouseMove, handleMouseLeave };
};
