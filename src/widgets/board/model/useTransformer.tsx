import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import type { Transformer } from "konva/lib/shapes/Transformer";
import { useCallback } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";

import { useBoardStore } from "./useBoardStore";
import { shouldPan } from "./useViewport";

export const useTransformer = () => {
  const handleTransformStart = useCallback(
    (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => {
      if (shouldPan(e.evt.button)) {
        e.evt.stopPropagation();
        e.evt.preventDefault();

        const transformer = e.currentTarget as unknown as Transformer;
        transformer.stopTransform();
        return;
      }
    },
    [],
  );

  const handleTransform = useThrottledCallback(
    (e: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => {
      const transformer = e.currentTarget as unknown as Transformer;

      const updates = new Map<string, Record<string, unknown>>();
      transformer.nodes().forEach((node) => {
        updates.set(node.id(), node.getAttrs());
      });

      useBoardStore.getState().updateElements(updates);
    },
    [],
  );

  return { handleTransformStart, handleTransform };
};
