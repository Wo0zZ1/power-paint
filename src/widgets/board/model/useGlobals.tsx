import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import type * as Y from "yjs";

export const useGlobals = (
  key: string,
  globalsRef: RefObject<Y.Map<unknown> | null>,
) => {
  const rafRef = useRef<number | null>(null);

  const setGlobal = useCallback(
    (value: unknown) => {
      rafRef.current = requestAnimationFrame(() => {
        globalsRef.current?.set(key, value);
      });
    },
    [key, globalsRef],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [rafRef]);

  return { setGlobal };
};
