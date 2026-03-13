// ─── Типы ───────────────────────────────────────────────────────────────────

export type BaseElement = {
  id: string;
  x: number;
  y: number;
};

export type CircleElement = {
  type: "circle";
  radius: number;
} & BaseElement;

export type RectElement = {
  type: "rect";
  width: number;
  height: number;
} & BaseElement;

export type Element = CircleElement | RectElement;

// ─── DB ──────────────────────────────────────────────────────────────

export type BoardData = {
  backgroundColor: string;
};

export type BoardDataMap = Map<number, BoardData>;

// ─── Awareness ──────────────────────────────────────────────────────────────

export type AwarenessUser = {
  name: string;
  color: string;
};

export type AwarenessState = {
  user: AwarenessUser;
  cursor: { x: number; y: number } | null; // null = курсор вне холста
};

export type RemoteCursorsMap = Map<number, AwarenessState>;
