"use client";

import type Konva from "konva";
import { useEffect } from "react";
import { Transformer } from "react-konva";
import { useShallow } from "zustand/react/shallow";

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
  const viewportScale = useBoardStore((s) => s.viewport.scale);
  const shiftPressed = useBoardStore((s) => s.modifiers.shift);

  const { handleTransformStart, handleTransform } = useTransformer({ canEdit });

  const elements = useBoardStore(useShallow((s) => s.elements));
  const isTextSelected =
    elements.get(Array.from(selectedIds)[0])?.type === "text";

  const keepRatio = selectedIds.size > 1 || shiftPressed;

  let enabledAnchors: string[] | undefined = undefined;

  if (!canEdit) {
    enabledAnchors = [];
  } else if (selectedIds.size > 1) {
    enabledAnchors = ["top-left", "top-right", "bottom-left", "bottom-right"];
  }

  useEffect(() => {
    const transformer = ref.current;
    if (!transformer) return;

    if (selectionType !== "transform") return void transformer.nodes();

    const contentLayer = useBoardStore.getState().contentLayer;
    if (!contentLayer) return;

    const nodes = getKonvaNodesFromLayer(contentLayer, Array.from(selectedIds));

    transformer.nodes(nodes);
  }, [ref, elements, selectedIds, selectionType]);

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
        if (isTextSelected && Math.abs(newBox.width) < 30 * viewportScale)
          return oldBox;

        return newBox;
      }}
      flipEnabled={false}
      ignoreStroke
      onTransformStart={handleTransformStart}
      onTransform={handleTransform}
    />
  );
}
