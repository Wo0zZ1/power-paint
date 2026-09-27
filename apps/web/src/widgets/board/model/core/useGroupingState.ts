import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { getGroupingSelectionState } from "../lib/grouping";

import { useBoardStore } from "./useBoardStore";

export const useGroupingState = () => {
  const { elements, selectedIds } = useBoardStore(
    useShallow((state) => ({
      elements: state.elements,
      selectedIds: state.selectedIds,
    })),
  );

  const groupingState = useMemo(
    () => getGroupingSelectionState(elements, selectedIds),
    [elements, selectedIds],
  );

  return {
    ...groupingState,
    selectedIds,
  };
};