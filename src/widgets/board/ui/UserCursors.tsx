"use client";

import { useBoardStore } from "../model/useBoardStore";

import { UserCursor } from "./UserCursor";

export function UserCursors() {
  const remoteCursors = useBoardStore((s) => s.remoteCursors);

  return (
    <>
      {Array.from(remoteCursors.entries()).map(([clientId, state]) => (
        <UserCursor key={clientId} state={state} />
      ))}
    </>
  );
}
