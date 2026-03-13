"use client";

import type { Layer } from "konva/lib/Layer";
import type { RefObject } from "react";

import { useBoardStore } from "../model/useBoardStore";

import { UserCursor } from "./UserCursor";

interface UserCursorsProps {
  canvasRef: RefObject<Layer | null>;
}

export function UserCursors({ canvasRef }: UserCursorsProps) {
  const remoteCursors = useBoardStore((s) => s.remoteCursors);

  return (
    <>
      {Array.from(remoteCursors.entries()).map(([clientId, state]) => (
        <UserCursor key={clientId} state={state} canvasRef={canvasRef} />
      ))}
    </>
  );
}
