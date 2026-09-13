"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { useBoardStore } from "../../model";

import { UserCursor } from "./UserCursor";

export function UserCursors() {
  const awareness = useBoardStore(useShallow((s) => s.awareness));
  const clientID = useBoardStore((s) => s.clientID);

  const omittedAwareness = useMemo(
    () =>
      Array.from(awareness.entries()).filter(
        ([clientId]) => clientId !== clientID,
      ),
    [awareness, clientID],
  );

  return (
    <>
      {omittedAwareness.map(([clientId, state]) => (
        <UserCursor key={clientId} state={state} />
      ))}
    </>
  );
}
