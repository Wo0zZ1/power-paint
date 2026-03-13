import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/**
 * Throttles callback execution using requestAnimationFrame.
 * Uses a ref to always call the latest callback without recreating the throttled function.
 *
 * @param callback - Function to throttle
 * @returns Stable throttled version of the callback
 */
export const useThrottledCallback = <Args extends unknown[], Return = void>(
  callback: (...args: Args) => Return,
): ((...args: Args) => void) => {
  const rafRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const throttled = useCallback((...args: Args) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      callbackRef.current(...args);
    });
  }, []); // stable reference — never recreated

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return throttled;
};
