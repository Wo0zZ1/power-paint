"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { useInvertableColor, useWindowSize } from "@/shared/lib/hooks";

import type { AwarenessUser } from "../model/types";
import { useBoardInteraction } from "../model/useBoardInteraction";
import { useBoardStore } from "../model/useBoardStore";
import { useHocuspocus } from "../model/useHocuspocus";
import { useHotKeys } from "../model/useHotKeys";
import { useMouseAwareness } from "../model/useMouseAwareness";

import { BottomToolbar } from "./BottomToolbar";
import { LayerContent } from "./LayerContent";
import { LeftSidebar } from "./LeftSidebar";
import { SelectionRect } from "./SelectionRect";
import { TransformerTool } from "./TransformerTool";
import { UndoRedoControls } from "./UndoRedoControls";
import { UserCursors } from "./UserCursors";
import { ZoomControls } from "./ZoomControls";

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

  const { windowSize } = useWindowSize();
  const { activeColor } = useInvertableColor(globals.backgroundColor, true);

  const { handleCursorMove, handleTouchCursorMove, handleCursorLeave } =
    useMouseAwareness();

  const { handlePointerDown, handleTouchStart, handleZoom } =
    useBoardInteraction({ selectionRectRef });

  return (
    <div className="w-full h-full min-w-0 min-h-0 overflow-hidden">
      <div
        ref={boardRef}
        onPointerMove={handleCursorMove}
        onTouchMove={handleTouchCursorMove}
        onPointerLeave={handleCursorLeave}
        className="w-full h-full min-w-0 min-h-0 relative select-none overflow-hidden touch-none"
      >
        <div className="absolute inset-5 pointer-events-none z-11">
          <div className="pointer-events-auto">
            <LeftSidebar className="absolute top-0 left-0" />
            <BottomToolbar className="absolute bottom-0 left-1/2 -translate-x-1/2" />

            <div className="absolute bottom-0 left-0 flex gap-4">
              <ZoomControls />
              <UndoRedoControls />
            </div>
          </div>
        </div>

        <Stage
          style={{ backgroundColor: activeColor }}
          width={windowSize.width - 2} // Borders
          height={windowSize.height - 2 - 72} // Borders + header
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
