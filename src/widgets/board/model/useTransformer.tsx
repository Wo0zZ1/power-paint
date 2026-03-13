import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import type { Transformer } from "konva/lib/shapes/Transformer";
import { useCallback, useRef } from "react";

import { useBoardStore } from "./useBoardStore";
import { shouldPan } from "./viewport/useViewport";

export const useTransformer = () => {
  const rafRef = useRef<number | null>(null);

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

  const applyTransform = useCallback((transformer: Transformer) => {
    const { elements, updateElement } = useBoardStore.getState();

    transformer.nodes().forEach((node) => {
      const id = node.id();
      const element = elements.get(id);
      if (!element) return;

      updateElement(id, node.getAttrs());
    });

    rafRef.current = null;
  }, []);

  const handleTransform = useCallback(
    (e: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      const transformer = e.currentTarget as unknown as Transformer;

      rafRef.current = requestAnimationFrame(() => applyTransform(transformer));
    },
    [applyTransform],
  );

  return { handleTransformStart, handleTransform };
};
