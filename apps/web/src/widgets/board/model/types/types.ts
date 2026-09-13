// ─── Элементы ────────────────────────────────────────────────────────

import type { Node, NodeConfig } from "konva/lib/Node";
import type { Session } from "next-auth";
import type { ComponentProps } from "react";
import type { KonvaNodeComponent } from "react-konva";

import {
  MAX_PASTE_TEXT_WIDTH,
  MIN_TEXT_HEIGHT,
  MIN_TEXT_WIDTH,
} from "@/shared/constants";

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

export type ElementType =
  | CircleElementType
  | RectElementType
  | DrawElementType
  | TextElementType;

// ─── Фабричные функции ───────────────────────────────────────────────

const baseDefaults = (): Omit<BaseElementType, "id"> => ({
  x: 0,
  y: 0,
  rotation: 0,
  opacity: 1,
});

export const createCircle = (
  overrides: Partial<Omit<CircleElementType, "type" | "id">> = {},
): CircleElementType => ({
  ...baseDefaults(),
  width: 0,
  height: 0,
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
  id: generateId(),
});

export const createRect = (
  overrides: Partial<Omit<RectElementType, "type" | "id">> = {},
): RectElementType => ({
  ...baseDefaults(),
  width: 0,
  height: 0,
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
  id: generateId(),
});

export const createDraw = (
  overrides: Partial<Omit<DrawElementType, "type" | "id">> = {},
): DrawElementType => ({
  ...baseDefaults(),
  points: [],
  strokeColor: "#000000",
  strokeWidth: 5,
  strokeType: "solid",
  ...overrides,
  type: "draw",
  id: generateId(),
});

const measureTextSize = (
  text: string,
  fontSize: number,
  fontFamily: string,
  maxWidth: number,
) => {
  if (typeof document === "undefined")
    return { width: MIN_TEXT_WIDTH, height: MIN_TEXT_HEIGHT };

  const span = document.createElement("span");
  span.style.font = `${fontSize}px ${fontFamily}`;
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "pre-wrap";
  span.style.wordBreak = "break-word";
  span.style.maxWidth = `${maxWidth}px`;
  span.style.display = "inline-block";
  span.style.lineHeight = "1.2";
  span.innerText = text || " ";
  document.body.appendChild(span);

  const width = Math.max(Math.ceil(span.offsetWidth) + 10, MIN_TEXT_WIDTH);
  const height = Math.max(Math.ceil(span.offsetHeight) + 10, MIN_TEXT_HEIGHT);

  document.body.removeChild(span);
  return { width, height };
};

export const createText = (
  overrides: Partial<Omit<TextElementType, "type" | "id">> = {},
): TextElementType => {
  let { width, height } = overrides;
  const text = overrides.text || "Text";
  const fontSize = overrides.fontSize || 24;
  const fontFamily = overrides.fontFamily || "Arial, sans-serif";

  if (!width || !height) {
    const size = measureTextSize(
      text,
      fontSize,
      fontFamily,
      MAX_PASTE_TEXT_WIDTH,
    );
    if (!width) width = size.width;
    if (!height) height = size.height;
  }

  return {
    ...baseDefaults(),
    text,
    fontSize,
    fontFamily,
    textAlign: "left",
    textVerticalAlign: "top",
    textColor: "#000000",
    width,
    height,
    ...overrides,
    type: "text",
    id: generateId(),
  };
};

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
