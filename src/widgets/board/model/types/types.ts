// ─── Элементы ────────────────────────────────────────────────────────

import type { Node, NodeConfig } from "konva/lib/Node";
import type { Session } from "next-auth";
import type { ComponentProps } from "react";
import type { KonvaNodeComponent } from "react-konva";

import { generateId } from "../lib/utils";

export type BaseElementType = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
};

export type BaseElementProps = ComponentProps<
  KonvaNodeComponent<Node, NodeConfig>
>;

export type FillType = "none" | "color" | "gradient";
export type GradientType = "linear" | "radial";

export interface IFillable {
  fillType: FillType;
  fillGradientType: GradientType;
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

export interface ISizable {
  width: number;
  height: number;
}

export type CircleElementType = {
  type: "circle";
} & BaseElementType &
  IFillable &
  IStrokable &
  ISizable;

export type RectElementType = {
  type: "rect";
} & BaseElementType &
  IFillable &
  IStrokable &
  ISizable;

export type DrawElementType = {
  type: "draw";
  points: number[]; // плоский массив [x1, y1, x2, y2, ...]
} & BaseElementType &
  IStrokable;

export type TextAlign = "left" | "center" | "right" | "justify";

export type VerticalAlign = "top" | "middle" | "bottom";

export type TextElementType = {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  textAlign: TextAlign;
  textVerticalAlign: VerticalAlign;
  textColor: string;
} & BaseElementType &
  ISizable;
// & IStrokable;

export type ElementType =
  | CircleElementType
  | RectElementType
  | DrawElementType
  | TextElementType;

// ─── Фабричные функции ───────────────────────────────────────────────

const baseDefaults = (): BaseElementType => ({
  id: generateId(),
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 1,
});

export const createCircle = (
  overrides: Partial<Omit<CircleElementType, "type">> = {},
): CircleElementType => ({
  ...baseDefaults(),
  width: 100,
  height: 100,
  fillType: "none",
  fillGradientType: "linear",
  fillColor1: "#000000",
  fillColor2: "#000000",
  fillAngle: 0,
  strokeColor: "#000000",
  strokeWidth: 3,
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
  fillType: "none",
  fillGradientType: "linear",
  fillColor1: "#000000",
  fillColor2: "#000000",
  fillAngle: 0,
  strokeColor: "#000000",
  strokeWidth: 3,
  strokeType: "solid",
  ...overrides,
  type: "rect",
});

export const createDraw = (
  overrides: Partial<Omit<DrawElementType, "type">> = {},
): DrawElementType => ({
  ...baseDefaults(),
  points: [],
  strokeColor: "#000000",
  strokeWidth: 5,
  strokeType: "solid",
  ...overrides,
  type: "draw",
});

export const createText = (
  overrides: Partial<Omit<TextElementType, "type">> = {},
): TextElementType => ({
  ...baseDefaults(),
  text: "",
  fontSize: 16,
  fontFamily: "Arial, sans-serif",
  textAlign: "left",
  textVerticalAlign: "top",
  textColor: "#000000",
  width: 60,
  height: 30,
  ...overrides,
  type: "text",
});

// ─── Type guards ─────────────────────────────────────────────────────

export const isRect = (el: ElementType): el is RectElementType =>
  el.type === "rect";

export const isCircle = (el: ElementType): el is CircleElementType =>
  el.type === "circle";

export const isDraw = (el: ElementType): el is DrawElementType =>
  el.type === "draw";

export const isText = (el: ElementType): el is TextElementType =>
  el.type === "text";

export const hasSize = <T extends ElementType>(el: T): el is T & ISizable =>
  isRect(el) || isText(el) || isCircle(el);

export const isFillable = <T extends ElementType>(el: T): el is IFillable & T =>
  isRect(el) || isCircle(el);

export const isStrokable = <T extends ElementType>(
  el: T,
): el is IStrokable & T => isRect(el) || isCircle(el) || isDraw(el);

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

export type SelectionType = "transform" | "delete" | "none";

export type Tool =
  | "select"
  | "hand"
  | "rect"
  | "circle"
  | "draw"
  | "eraser"
  | "text";

// ─── Awareness ───────────────────────────────────────────────────────

export type UserAwareness = {
  name: string[];
  color: string;
  image: string | null;
  id: Session["user"]["id"] | null;
};

export type AwarenessState = {
  user: UserAwareness;
  cursor: { x: number; y: number } | null; // null = курсор вне холста
};

export type AwarenessMap = Map<number, AwarenessState>;
