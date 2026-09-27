import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import type { Transformer } from "konva/lib/shapes/Transformer";
import { useCallback } from "react";

import { useThrottledCallback } from "@/shared/lib/hooks";

import { useBoardStore } from "../core";

import { shouldPan } from "./useViewport";

interface UseTransformerProps {
  canEdit: boolean;
}

export const useTransformer = ({ canEdit }: UseTransformerProps) => {
  const handleTransformStart = useCallback(
    (e: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => {
      if (canEdit && !shouldPan(e.evt)) return;

      e.evt.stopPropagation();
      e.evt.preventDefault();

      const transformer = e.currentTarget as unknown as Transformer;
      transformer.stopTransform();
    },
    [canEdit],
  );

  const throttledStoreUpdate = useThrottledCallback(
    (updates: Map<string, Record<string, unknown>>) => {
      useBoardStore.getState().updateElements(updates);
    },
  );

  const handleTransform = useCallback(
    (e: KonvaEventObject<PointerEvent, Node<NodeConfig>>) => {
      const transformer = e.currentTarget as unknown as Transformer;
      const elements = useBoardStore.getState().elements;

      const updates = new Map<string, Record<string, unknown>>();
      transformer.nodes().forEach((node) => {
        const el = elements.get(node.id());

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        if (el) {
          switch (el.type) {
            case "image":
            case "rect":
              node.setAttrs({
                width: Math.max(1, node.width() * Math.abs(scaleX)),
                height: Math.max(1, node.height() * Math.abs(scaleY)),
                scaleX: 1,
                scaleY: 1,
              });
              break;
            case "circle":
              const newCircleWidth = Math.max(
                1,
                node.width() * Math.abs(scaleX),
              );
              const newCircleHeight = Math.max(
                1,
                node.height() * Math.abs(scaleY),
              );

              node.setAttrs({
                width: newCircleWidth,
                height: newCircleHeight,
                radiusX: newCircleWidth / 2,
                radiusY: newCircleHeight / 2,
                scaleX: 1,
                scaleY: 1,
              });
              node.attrs.width = newCircleWidth;
              node.attrs.height = newCircleHeight;
              break;
            case "draw":
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
              break;
            case "text":
              const newTextWidth = Math.max(
                30,
                node.width() * Math.abs(scaleX),
              );
              const newTextHeight = Math.max(
                10,
                node.height() * Math.abs(scaleY),
              );
              node.setAttrs({
                width: newTextWidth,
                height: newTextHeight,
                scaleX: 1,
                scaleY: 1,
              });
              break;
            default:
              const _: never = el;
          }
        }

        updates.set(node.id(), node.getAttrs());
      });

      transformer.forceUpdate();

      throttledStoreUpdate(updates);
    },
    [throttledStoreUpdate],
  );

  return { handleTransformStart, handleTransform };
};
