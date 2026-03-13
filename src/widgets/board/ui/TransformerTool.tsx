"use client";

import type Konva from "konva";
import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

import { useBoardStore } from "../model/useBoardStore";
import { useTransformer } from "../model/useTransformer";

export function TransformerTool() {
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const shiftPressed = useBoardStore((s) => s.modifiers.shift);

  const { handleTransformStart, handleTransform } = useTransformer();

  const keepRatio = selectedIds.size > 1 || shiftPressed;

  const enabledAnchors =
    selectedIds.size > 1
      ? ["top-left", "top-right", "bottom-left", "bottom-right"]
      : undefined;

  useEffect(() => {
    if (!transformerRef.current) return;

    const layer = transformerRef.current.getLayer()!;

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
      onTransformStart={handleTransformStart}
      onTransform={handleTransform}
      ref={transformerRef}
    />
  );
}
