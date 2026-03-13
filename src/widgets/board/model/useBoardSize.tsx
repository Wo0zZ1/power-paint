import type { RefObject } from "react";
import { useLayoutEffect, useState } from "react";

interface useBoardSizeProps {
  boardRef: RefObject<HTMLDivElement | null>;
}

export const useBoardSize = ({ boardRef }: useBoardSizeProps) => {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const container = boardRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStageSize({ width: width - 2, height: height - 2 });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [boardRef]);

  return { stageSize };
};
