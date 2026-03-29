"use client";

import type Konva from "konva";
import type { Layer } from "konva/lib/Layer";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore, useTransformer } from "../../model";

interface TransformerToolProps {
  contentLayerRef: RefObject<Layer | null>;
  canEdit: boolean;
}

export function TransformerTool({
  contentLayerRef,
  canEdit,
}: TransformerToolProps) {
  const transformerRef = useRef<Konva.Transformer>(null);
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
    const transformer = transformerRef.current;
    const layer = contentLayerRef.current;
    if (!transformer || !layer) return;

    if (selectionType !== "transform") return void transformer.nodes();

    const nodes = Array.from(selectedIds)
      .map((id) => layer.findOne(`#${id}`))
      .filter((node) => !!node);

    transformer.nodes(nodes);
  }, [elements, contentLayerRef, selectedIds, selectionType]);

  return (
    <Transformer
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
      ref={transformerRef}
    />
  );
}
