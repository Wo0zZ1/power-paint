import { useCallback, useEffect, useRef } from "react";

import { useBoardStore } from "./useBoardStore";

export const useSetGlobal = (key: string) => {
  const rafRef = useRef<number | null>(null);

  const set = useCallback(
    (value: unknown) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        useBoardStore.getState().setGlobal(key, value);
      });
    },
    [key],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return set;
};
