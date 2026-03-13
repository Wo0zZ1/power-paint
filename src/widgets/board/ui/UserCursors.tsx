"use client";

import type { RemoteCursorsMap } from "../model/types";

import { UserCursor } from "./UserCursor";

interface UserCursorsProps {
  remoteCursors?: RemoteCursorsMap;
}

export function UserCursors({ remoteCursors }: UserCursorsProps) {
  return (
    <>
      {remoteCursors &&
        Array.from(remoteCursors.entries()).map(([clientId, state]) => (
          <UserCursor key={clientId} state={state} />
        ))}
    </>
  );
}
