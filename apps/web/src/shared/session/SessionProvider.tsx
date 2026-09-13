"use client";

import type { SessionUser } from "@power-paint/contracts";
import { createContext, useContext } from "react";

interface SessionContextValue {
  user: SessionUser | null;
}

const SessionContext = createContext<SessionContextValue>({ user: null });

interface SessionProviderProps {
  user: SessionUser | null;
  children: React.ReactNode;
}

// Сессия приходит с сервера уже разрешённой и кладётся в контекст: клиенту
// не нужно повторять те же два запроса при первой отрисовке.
export function SessionProvider({ user, children }: SessionProviderProps) {
  return (
    <SessionContext value={{ user }}>{children}</SessionContext>
  );
}

export const useSession = () => useContext(SessionContext);
