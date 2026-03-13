// ─── Элементы ────────────────────────────────────────────────────────

export type BaseElementType = {
  id: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

export type CircleElementType = {
  type: "circle";
  radius: number;
} & BaseElementType;

export type RectElementType = {
  type: "rect";
  width: number;
  height: number;
} & BaseElementType;

export type StrokeElementType = {
  type: "stroke";
  points: number[]; // плоский массив [x1, y1, x2, y2, ...]
  color: string;
  strokeWidth: number;
} & BaseElementType;

export type ElementType = CircleElementType | RectElementType | StrokeElementType;

// ─── Viewport ────────────────────────────────────────────────────────

export type Viewport = {
  scale: number;
  x: number;
  y: number;
};

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
