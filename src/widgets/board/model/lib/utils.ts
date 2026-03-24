import type { Context } from "konva/lib/Context";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import type { Vector2d } from "konva/lib/types";

import { degToRad } from "@/shared/lib/utils";

import type {
  CircleElementType,
  FillType,
  GradientType,
  RectElementType,
  SelectionType,
  StrokeType,
} from "../types";

export const generateId = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const getFillPriority = (
  fillType: FillType,
  gradientType: GradientType,
): "none" | "color" | "linear-gradient" | "radial-gradient" => {
  if (fillType === "none") return "none";
  if (fillType === "gradient") {
    if (gradientType === "linear") return "linear-gradient";
    else if (gradientType === "radial") return "radial-gradient";
  }
  return "color";
};

export const getDash = (strokeType: StrokeType): number[] => {
  switch (strokeType) {
    case "dashed":
      return [6, 3];
    case "dash_dotted":
      return [6, 3, 2, 3];
    case "solid":
    default:
      return [];
  }
};

export const getOpacity = (
  baseOpacity: number,
  isSelected: boolean,
  selectionType: SelectionType,
) => {
  return isSelected && selectionType === "delete"
    ? baseOpacity * 0.5
    : baseOpacity;
};

// Rect Element

export const getRectPoints = (element: RectElementType) => {
  const angle = degToRad(element.fillAngle);

  const centerPoint: Vector2d = {
    x: element.width / 2,
    y: element.height / 2,
  };

  // Получаем 4 угла прямоугольника (относительно центра)
  const corners = [
    { x: -element.width / 2, y: -element.height / 2 },
    { x: element.width / 2, y: -element.height / 2 },
    { x: -element.width / 2, y: element.height / 2 },
    { x: element.width / 2, y: element.height / 2 },
  ];

  // Находим проекции углов на направление градиента
  const projections = corners.map(
    (corner) => corner.x * Math.cos(angle) + corner.y * Math.sin(angle),
  );

  const minProjection = Math.min(...projections);
  const maxProjection = Math.max(...projections);

  // Вычисляем стартовую и конечную точки градиента
  const startPoint: Vector2d = {
    x: centerPoint.x + minProjection * Math.cos(angle),
    y: centerPoint.y - minProjection * Math.sin(angle),
  };

  const endPoint: Vector2d = {
    x: centerPoint.x + maxProjection * Math.cos(angle),
    y: centerPoint.y - maxProjection * Math.sin(angle),
  };

  const fillRadialGradientEndRadius = Math.sqrt(
    (element.width / 2) ** 2 + (element.height / 2) ** 2,
  );

  return { startPoint, endPoint, centerPoint, fillRadialGradientEndRadius };
};

// Circle Element

export const getCirclePoints = (element: CircleElementType) => {
  // Вычисляем точки градиента
  const angle = degToRad(element.fillAngle);
  const startPoint: Vector2d = {
    x: -(element.width / 2) * Math.cos(angle),
    y: (element.height / 2) * Math.sin(angle),
  };
  const endPoint: Vector2d = {
    x: (element.width / 2) * Math.cos(angle),
    y: -(element.height / 2) * Math.sin(angle),
  };

  const fillRadialGradientEndRadius =
    Math.max(element.width, element.height) / 2;

  return { startPoint, endPoint, fillRadialGradientEndRadius };
};

export const getCircleOffset = (element: CircleElementType) => {
  return {
    x: -(element.width / 2),
    y: -(element.height / 2),
  };
};

// Text Element

export const getTextHitFunc = () => {
  return (context: Context, shape: Shape<ShapeConfig>) => {
    context.beginPath();
    context.rect(0, 0, shape.width(), shape.height());
    context.closePath();
    context.fillStrokeShape(shape);
  };
};
