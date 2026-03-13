import { useCallback, useEffect, useRef } from "react";

/**
 * Throttles callback execution using requestAnimationFrame.
 *
 * @param callback - Function to throttle
 * @param deps - Dependency array for the callback
 * @returns Throttled version of the callback
 */
export const useThrottledCallback = <Args extends unknown[], Return = void>(
  callback: (...args: Args) => Return,
  deps: React.DependencyList,
): ((...args: Args) => void) => {
  const rafRef = useRef<number | null>(null);

  const throttled = useCallback(
    (...args: Args) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        callback(...args);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return throttled;
};
