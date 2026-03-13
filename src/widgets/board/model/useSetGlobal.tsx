import { useThrottledCallback } from "../lib/useThrottledCallback";

import { useBoardStore } from "./useBoardStore";

export const useSetGlobal = (key: string) => {
  const set = useThrottledCallback(
    (value: unknown) => {
      useBoardStore.getState().setGlobal(key, value);
    },
    [key],
  );

  return set;
};
