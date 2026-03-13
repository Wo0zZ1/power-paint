// ─── Элементы ────────────────────────────────────────────────────────

import { generateId } from "../lib/utils";

export type BaseElementType = {
  id: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  // strokeColor: string;
  opacity: number;
};

export type FillType = null | "color" | "gradient";
export type GradientType = "linear" | "radial";

export interface IFillable {
  fillType: FillType;
  gradientType: GradientType;
  fillColor1: string;
  fillColor2: string;
  fillAngle: number;
}

export type StrokeType = "solid" | "dashed" | "dash_dotted";

export interface IStrokable {
  strokeColor: string;
  strokeWidth: number;
  strokeType: StrokeType;
}

export type CircleElementType = {
  type: "circle";
  radius: number;
} & BaseElementType &
  IFillable &
  IStrokable;

export type RectElementType = {
  type: "rect";
  width: number;
  height: number;
} & BaseElementType &
  IFillable &
  IStrokable;

export type StrokeElementType = {
  type: "stroke";
  points: number[]; // плоский массив [x1, y1, x2, y2, ...]
} & BaseElementType &
  IStrokable;

export type TextElementType = {
  type: "text";
  text: string;
  fontSize: number;
  color: string;
} & BaseElementType;
// & IStrokable;

export type ElementType =
  | CircleElementType
  | RectElementType
  | StrokeElementType
  | TextElementType;

// ─── Фабричные функции ───────────────────────────────────────────────

const baseDefaults = (): BaseElementType => ({
  id: generateId(),
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  opacity: 1,
});

export const createCircle = (
  overrides: Partial<Omit<CircleElementType, "type">> = {},
): CircleElementType => ({
  ...baseDefaults(),
  radius: 50,
  fillType: "color",
  gradientType: "linear",
  fillColor1: "#000000",
  fillColor2: "#000000",
  fillAngle: 0,
  strokeColor: "#ffffff",
  strokeWidth: 0,
  strokeType: "solid",
  ...overrides,
  type: "circle",
});

export const createRect = (
  overrides: Partial<Omit<RectElementType, "type">> = {},
): RectElementType => ({
  ...baseDefaults(),
  width: 100,
  height: 100,
  fillType: "color",
  gradientType: "linear",
  fillColor1: "#000000",
  fillColor2: "#000000",
  fillAngle: 0,
  strokeColor: "#ffffff",
  strokeWidth: 0,
  strokeType: "solid",
  ...overrides,
  type: "rect",
});

export const createStroke = (
  overrides: Partial<Omit<StrokeElementType, "type">> = {},
): StrokeElementType => ({
  ...baseDefaults(),
  points: [],
  strokeColor: "#000000",
  strokeWidth: 5,
  strokeType: "solid",
  ...overrides,
  type: "stroke",
});

export const createText = (
  overrides: Partial<Omit<TextElementType, "type">> = {},
): TextElementType => ({
  ...baseDefaults(),
  text: "",
  fontSize: 16,
  color: "#000000",
  ...overrides,
  type: "text",
});

// ─── Type guards ─────────────────────────────────────────────────────

export const isRect = (el: ElementType): el is RectElementType =>
  el.type === "rect";

export const isCircle = (el: ElementType): el is CircleElementType =>
  el.type === "circle";

export const isStroke = (el: ElementType): el is StrokeElementType =>
  el.type === "stroke";

export const isText = (el: ElementType): el is TextElementType =>
  el.type === "text";

export const isFillable = <T extends ElementType>(el: T): el is IFillable & T =>
  isRect(el) || isCircle(el);

export const isStrokable = <T extends ElementType>(
  el: T,
): el is IStrokable & T => isRect(el) || isCircle(el) || isStroke(el);

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
