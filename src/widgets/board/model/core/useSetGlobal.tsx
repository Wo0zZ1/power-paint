import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "./useBoardStore";

export const useSetGlobal = (key: string) => {
  const set = useThrottledCallback((value: unknown) => {
    useBoardStore.getState().setGlobal(key, value);
  });

  return set;
};
