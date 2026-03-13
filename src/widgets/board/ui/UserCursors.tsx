"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore } from "../model/useBoardStore";

import { UserCursor } from "./UserCursor";

export function UserCursors() {
  const remoteCursors = useBoardStore(useShallow((s) => s.remoteCursors));

  const cursorsList = useMemo(
    () => Array.from(remoteCursors.entries()),
    [remoteCursors],
  );

  return (
    <>
      {cursorsList.map(([clientId, state]) => (
        <UserCursor key={clientId} state={state} />
      ))}
    </>
  );
}
