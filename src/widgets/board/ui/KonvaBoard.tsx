"use client";

import type { Board } from "@prisma/client";
import type Konva from "konva";
import { useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import { useShallow } from "zustand/react/shallow";

import { AccessRole } from "@/shared/constants";
import { useWindowSize, useInvertableColor } from "@/shared/lib/hooks";

import type { UserAwareness } from "../model";
import {
  useBoardStore,
  useHotKeys,
  useHocuspocus,
  useMouseAwareness,
  useBoardInteraction,
} from "../model";
import { useBoardPreview } from "../model/core/useBoardPreview";

import {
  LayerContent,
  TransformerTool,
  SelectionElement,
  EraserElement,
} from "./elements";
import { BoardContextMenu } from "./menu/BoardContextMenu";
import {
  UndoRedoControls,
  ZoomControls,
  UserCursors,
  DeleteSelectionButton,
  BackToContentButton,
} from "./overlay";
import { ActiveUsers } from "./overlay/ActiveUsers";
import { ConnectionStatus } from "./overlay/ConnectionStatus";
import { LeftSidebar } from "./sidebar";
import { BottomToolbar } from "./toolbar";

interface KonvaBoardProps {
  userAwareness: UserAwareness;
  accessToken: string;
  boardId: Board["id"];
  accessRole: AccessRole;
}

export function KonvaBoard({
  userAwareness,
  accessToken,
  boardId,
  accessRole,
}: KonvaBoardProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const contentLayerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);
  const eraserLineRef = useRef<Konva.Line>(null);

  const globals = useBoardStore(useShallow((s) => s.globals));
  const viewport = useBoardStore(useShallow((s) => s.viewport));
  const connectionStatus = useBoardStore((s) => s.connectionStatus);

  const canEdit = AccessRole[accessRole] >= AccessRole.EDITOR;

  useHotKeys();
  useBoardPreview({ boardId });
  useHocuspocus({ userAwareness, accessToken, boardId });

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const { activeColor } = useInvertableColor(globals.backgroundColor, true);

  const { handleTouchMove, handlePointerMove, handlePointerLeave } =
    useMouseAwareness();

  const { handlePointerDown, handleTouchStart, handleContextMenu, handleZoom } =
    useBoardInteraction({ canEdit });

  useEffect(() => {
    if (stageRef.current) useBoardStore.getState().setStage(stageRef.current);
  }, [stageRef]);

  useEffect(() => {
    if (contentLayerRef.current)
      useBoardStore.getState().setContentLayer(contentLayerRef.current);
  }, [contentLayerRef]);

  useEffect(() => {
    if (selectionRectRef.current)
      useBoardStore.getState().setSelectionRect(selectionRectRef.current);
  }, [selectionRectRef]);

  useEffect(() => {
    if (eraserLineRef.current)
      useBoardStore.getState().setEraserLine(eraserLineRef.current);
  }, [eraserLineRef]);

  return (
    <div className="w-full h-full min-w-0 min-h-0 overflow-hidden">
      <div
        onTouchMove={handleTouchMove}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full min-w-0 min-h-0 relative select-none overflow-hidden touch-none"
      >
        <div className="absolute w-auto mx-auto inset-5 pointer-events-none z-11">
          {/* Top Right */}
          <div className="absolute flex items-start gap-4 top-0 right-0">
            <ConnectionStatus status={connectionStatus} />
            <ActiveUsers className="pointer-events-auto" />
          </div>

          {/* Top Left */}
          {canEdit && (
            <LeftSidebar className="hidden md:block pointer-events-auto absolute top-0 left-0" />
          )}

          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 hidden md:flex gap-4">
            <ZoomControls className="pointer-events-auto" />
            {canEdit && <UndoRedoControls className="pointer-events-auto" />}
          </div>

          {/* Bottom Center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col gap-2">
            <div className="flex justify-center mb-2">
              <BackToContentButton className="pointer-events-auto" />
            </div>

            <div className="md:hidden flex">
              {canEdit && (
                <DeleteSelectionButton className="pointer-events-auto" />
              )}

              {canEdit && (
                <UndoRedoControls
                  className="pointer-events-auto ml-auto"
                  tooltipActive={false}
                />
              )}
            </div>

            <BottomToolbar
              tools={!canEdit ? ["select", "hand"] : undefined}
              className="pointer-events-auto"
            />
          </div>
        </div>

        <Stage
          ref={stageRef}
          style={{ backgroundColor: activeColor }}
          width={windowWidth - 2} // Borders
          height={windowHeight - 2 - 72} // Borders + header
          x={viewport.x}
          y={viewport.y}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          onWheel={handleZoom}
          onPointerDown={handlePointerDown}
          onTouchStart={handleTouchStart}
          onContextMenu={handleContextMenu}
        >
          <Layer ref={contentLayerRef}>
            <LayerContent canEdit={canEdit} />
          </Layer>

          <Layer>
            <SelectionElement ref={selectionRectRef} />
            <TransformerTool canEdit={canEdit} ref={transformerRef} />
            <EraserElement ref={eraserLineRef} />
          </Layer>

          <Layer>
            <UserCursors />
          </Layer>
        </Stage>

        <BoardContextMenu />
      </div>
    </div>
  );
}
