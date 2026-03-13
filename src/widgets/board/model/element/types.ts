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

export type ElementType = CircleElementType | RectElementType;
