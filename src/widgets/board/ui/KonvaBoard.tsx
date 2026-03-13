"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useCallback, useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import type { AwarenessUser } from "../model/types";
import { useBoardSize } from "../model/useBoardSize";
import { useBoardStore } from "../model/useBoardStore";
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
  const stageRef = useRef<Konva.Stage>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const globals = useBoardStore(useShallow((s) => s.globals));
  const viewport = useBoardStore(useShallow((s) => s.viewport));

  useHotKeys();
  useHocuspocus({ boardId, user });

  const { stageSize } = useBoardSize({ boardRef });

  const { handleZoom, startPan } = useViewport();
  const { handleCursorMove, handleCursorLeave } = useMouseAwareness();
  const { startSelecting } = useSelectionRect({ rectRef: selectionRectRef });

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (shouldPan(e.evt.button)) {
        startPan(e.evt.clientX, e.evt.clientY);
        return;
      }

      if (e.evt.button === 0) startSelecting(e);
    },
    [startPan, startSelecting],
  );

  return (
    <div className="w-full h-full pl-3.75 mr-3.75 rounded-lg overflow-clip">
      <div
        ref={boardRef}
        onMouseMove={handleCursorMove}
        onMouseLeave={handleCursorLeave}
        className="w-full h-full relative"
      >
        <Toolbar className="absolute flex gap-2 z-10" user={user} />

        <Stage
          ref={stageRef}
          className="border border-muted"
          style={{ backgroundColor: globals.backgroundColor }}
          width={stageSize.width}
          height={stageSize.height}
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          onWheel={handleZoom}
          onMouseDown={handleMouseDown}
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
