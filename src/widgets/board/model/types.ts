// ─── Глобальные настройки доски ──────────────────────────────────────

export type GlobalsState = {
  backgroundColor: string;
};

// ─── Типы инструментов ───────────────────────────────────────────────

export type Tool =
  | "select"
  | "hand"
  | "rect"
  | "circle"
  | "draw"
  | "eraser"
  | "text";

// ─── Awareness ───────────────────────────────────────────────────────

export type AwarenessUser = {
  guest: boolean;
  name: string[];
  color: string;
};

export type AwarenessState = {
  user: AwarenessUser;
  cursor: { x: number; y: number } | null; // null = курсор вне холста
};

export type RemoteCursorsMap = Map<number, AwarenessState>;
