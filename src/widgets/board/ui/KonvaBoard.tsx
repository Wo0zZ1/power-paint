"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useCallback, useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import type { AwarenessUser } from "../model/types";
import { useBoardSize } from "../model/useBoardSize";
import { useBoardStore } from "../model/useBoardStore";
import { useDrawing } from "../model/useDrawing";
import { useHocuspocus } from "../model/useHocuspocus";
import { useHotKeys } from "../model/useHotKeys";
import { useMouseAwareness } from "../model/useMouseAwareness";
import { useSelectionRect } from "../model/useSelectionRect";
import { shouldPan, useViewport } from "../model/useViewport";

import { LayerContent } from "./LayerContent";
import { SelectionRect } from "./SelectionRect";
import { Toolbar } from "./Toolbar";
import { TransformerTool } from "./TransformerTool";
import { UserCursors } from "./UserCursors";

interface KonvaBoardProps {
  user: AwarenessUser;
  boardId: Board["id"];
}

export function KonvaBoard({ user, boardId }: KonvaBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const globals = useBoardStore(useShallow((s) => s.globals));
  const viewport = useBoardStore(useShallow((s) => s.viewport));

  useHotKeys();
  useHocuspocus({ boardId, user });

  const { stageSize } = useBoardSize({ boardRef });

  const { handleCursorMove, handleTouchCursorMove, handleCursorLeave } =
    useMouseAwareness();

  const { handleZoom, startPointerPan, startTouchPan } = useViewport();

  const { startPointerDraw, startTouchDraw } = useDrawing();

  const { startPointerSelect, startTouchSelect } = useSelectionRect({
    rectRef: selectionRectRef,
  });

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      if (shouldPan(e.evt)) return startPointerPan(e);

      if (e.evt.button !== 0) return;

      const { tool, clearSelection } = useBoardStore.getState();

      if (tool === "select") return startPointerSelect(e);

      clearSelection();

      if (tool === "draw") return startPointerDraw(e);
    },
    [startPointerPan, startPointerSelect, startPointerDraw],
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.cancelable) e.evt.preventDefault();

      const { tool, clearSelection } = useBoardStore.getState();

      if (tool === "hand" || e.evt.touches.length >= 2) return startTouchPan(e);

      if (e.evt.touches.length > 1) return;

      if (tool === "select") return startTouchSelect(e);

      clearSelection();

      if (tool === "draw") return startTouchDraw(e);
    },
    [startTouchPan, startTouchSelect, startTouchDraw],
  );

  return (
    <div className="w-full h-full min-w-0 min-h-0 px-3.75 rounded-lg overflow-hidden">
      <div
        ref={boardRef}
        onPointerMove={handleCursorMove}
        onTouchMove={handleTouchCursorMove}
        onPointerLeave={handleCursorLeave}
        className="w-full h-full min-w-0 min-h-0 relative select-none overflow-hidden touch-none"
      >
        <Toolbar className="absolute flex gap-2 z-10" user={user} />

        <Stage
          className="border border-muted"
          style={{ backgroundColor: globals.backgroundColor }}
          width={stageSize.width}
          height={stageSize.height}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          onWheel={handleZoom}
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
        >
          <Layer>
            <LayerContent />
            <TransformerTool />
          </Layer>

          <Layer>
            <SelectionRect rectRef={selectionRectRef} />
          </Layer>

          <Layer>
            <UserCursors />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
