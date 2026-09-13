"use client";

import type Konva from "konva";
import { useEffect } from "react";
import { Transformer } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { MIN_TEXT_HEIGHT, MIN_TEXT_WIDTH } from "@/shared/constants";

import {
  getKonvaNodesFromLayer,
  useBoardStore,
  useTransformer,
} from "../../model";

interface TransformerToolProps {
  canEdit: boolean;
  ref: React.RefObject<Konva.Transformer | null>;
}

export function TransformerTool({ canEdit, ref }: TransformerToolProps) {
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore(useShallow((s) => s.selectionType));
  const elements = useBoardStore(useShallow((s) => s.elements));

  const viewportScale = useBoardStore((s) => s.viewport.scale);
  const shiftPressed = useBoardStore((s) => s.modifiers.shift);

  const { handleTransformStart, handleTransform } = useTransformer({ canEdit });

  const isTextSelected = Array.from(selectedIds).some(
    (id) => elements.get(id)?.type === "text",
  );

  const keepRatio = selectedIds.size > 1 || shiftPressed;

  let enabledAnchors: string[] | undefined = undefined;

  if (!canEdit) {
    enabledAnchors = [];
  } else if (selectedIds.size > 1) {
    enabledAnchors = ["top-left", "top-right", "bottom-left", "bottom-right"];
  }

  const presentSelectedIds = Array.from(selectedIds)
    .filter((id) => elements.has(id))
    .sort()
    .join(",");

  useEffect(() => {
    const transformer = ref.current;
    if (!transformer) return;

    if (selectionType !== "transform") return void transformer.nodes();

    const contentLayer = useBoardStore.getState().contentLayer;
    if (!contentLayer) return;

    const validIds = presentSelectedIds ? presentSelectedIds.split(",") : [];
    const nodes = getKonvaNodesFromLayer(contentLayer, validIds);

    transformer.nodes(nodes);
  }, [ref, selectionType, presentSelectedIds]);

  return (
    <Transformer
      ref={ref}
      id="transformer"
      keepRatio={keepRatio}
      enabledAnchors={enabledAnchors}
      anchorCornerRadius={100}
      rotateEnabled={canEdit}
      rotationSnapTolerance={5}
      rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
      boundBoxFunc={(oldBox, newBox) => {
        if (isTextSelected) {
          const minW = MIN_TEXT_WIDTH * viewportScale;
          const minH = MIN_TEXT_HEIGHT * viewportScale;

          if (Math.abs(newBox.width) < minW) {
            newBox.width = oldBox.width;
            newBox.x = oldBox.x;
          }
          if (Math.abs(newBox.height) < minH) {
            newBox.height = oldBox.height;
            newBox.y = oldBox.y;
          }
        }

        return newBox;
      }}
      flipEnabled={false}
      onTransformStart={handleTransformStart}
      onTransform={handleTransform}
    />
  );
}
