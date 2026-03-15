import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import type { Transformer } from "konva/lib/shapes/Transformer";
import { useCallback } from "react";

import { useThrottledCallback } from "../lib/useThrottledCallback";

import { useBoardStore } from "./useBoardStore";
import { shouldPan } from "./useViewport";

export const useTransformer = () => {
  const handleTransformStart = useCallback(
    (e: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => {
      if (shouldPan(e.evt)) {
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
      const elements = useBoardStore.getState().elements;

      const updates = new Map<string, Record<string, unknown>>();
      transformer.nodes().forEach((node) => {
        const el = elements.get(node.id());

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        if (el?.type === "rect") {
          node.setAttrs({
            width: Math.max(1, node.width() * Math.abs(scaleX)),
            height: Math.max(1, node.height() * Math.abs(scaleY)),
            scaleX: 1,
            scaleY: 1,
          });
        } else if (el?.type === "circle") {
          const newWidth = Math.max(1, node.width() * Math.abs(scaleX));
          const newHeight = Math.max(1, node.height() * Math.abs(scaleY));

          node.setAttrs({
            width: newWidth,
            height: newHeight,
            radiusX: newWidth / 2,
            radiusY: newHeight / 2,
            offsetX: -(newWidth / 2),
            offsetY: -(newHeight / 2),
            scaleX: 1,
            scaleY: 1,
          });
        } else if (el?.type === "stroke") {
          const oldPoints = node.getAttr("points") as number[];
          const newPoints = oldPoints.map((val, i) => {
            return i % 2 === 0
              ? val * Math.abs(scaleX)
              : val * Math.abs(scaleY);
          });
          node.setAttrs({
            points: newPoints,
            scaleX: 1,
            scaleY: 1,
          });
        } else if (el?.type === "text") {
          const newWidth = Math.max(30, node.width() * Math.abs(scaleX));
          const newHeight = Math.max(10, node.height() * Math.abs(scaleY));
          node.setAttrs({
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1,
          });
        }

        updates.set(node.id(), node.getAttrs());
      });

      useBoardStore.getState().updateElements(updates);
      transformer.forceUpdate();
    },
  );

  return { handleTransformStart, handleTransform };
};
