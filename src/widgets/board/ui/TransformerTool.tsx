"use client";

import type Konva from "konva";
import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore } from "../model/useBoardStore";
import { useTransformer } from "../model/useTransformer";

export function TransformerTool() {
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const shiftPressed = useBoardStore((s) => s.modifiers.shift);
  const viewport = useBoardStore(useShallow((s) => s.viewport));

  const { handleTransformStart, handleTransform } = useTransformer();

  const elements = useBoardStore(useShallow((s) => s.elements));
  const isTextSelected =
    elements.get(Array.from(selectedIds)[0])?.type === "text";

  const keepRatio = selectedIds.size > 1 || shiftPressed;

  let enabledAnchors: string[] | undefined = undefined;

  if (selectedIds.size > 1)
    enabledAnchors = ["top-left", "top-right", "bottom-left", "bottom-right"];

  useEffect(() => {
    if (!transformerRef.current) return;

    const layer = transformerRef.current.getLayer();
    if (!layer) return;

    const nodes = Array.from(selectedIds)
      .map((id) => layer.findOne(`#${id}`))
      .filter((node): node is Konva.Node => node !== null);

    transformerRef.current.nodes(nodes);
  }, [selectedIds]);

  return (
    <Transformer
      id="transformer"
      keepRatio={keepRatio}
      enabledAnchors={enabledAnchors}
      anchorCornerRadius={100}
      rotationSnapTolerance={5}
      rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
      boundBoxFunc={(oldBox, newBox) => {
        if (isTextSelected && Math.abs(newBox.width) < 30 * viewport.scale)
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
