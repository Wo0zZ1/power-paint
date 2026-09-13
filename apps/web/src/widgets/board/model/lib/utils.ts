import type { Context } from "konva/lib/Context";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import type { Vector2d } from "konva/lib/types";

import { degToRad } from "@/shared/lib/utils";

import type {
  CircleElementType,
  ElementType,
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

// Draw Element

export const getDrawElementLocalBounds = (
  points: number[],
): { minX: number; minY: number; maxX: number; maxY: number } => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < points.length; i += 2) {
    if (points[i] < minX) minX = points[i];
    if (points[i] > maxX) maxX = points[i];
    if (points[i + 1] < minY) minY = points[i + 1];
    if (points[i + 1] > maxY) maxY = points[i + 1];
  }

  if (minX === Infinity) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  return { minX, minY, maxX, maxY };
};

// Rotation util

export const rotateElementAroundCenter = (
  element: ElementType,
  newRotation: number,
): Partial<ElementType> => {
  let cx_local = 0;
  let cy_local = 0;

  if ("width" in element && "height" in element) {
    cx_local = element.width / 2;
    cy_local = element.height / 2;
  } else if (element.type === "draw") {
    const { minX, minY, maxX, maxY } = getDrawElementLocalBounds(
      element.points,
    );
    cx_local = (minX + maxX) / 2;
    cy_local = (minY + maxY) / 2;
  } else {
    return { rotation: newRotation };
  }

  const rad1 = element.rotation * (Math.PI / 180);
  const rad2 = newRotation * (Math.PI / 180);

  // Вычисляем глобальный центр элемента до поворота
  const global_cx =
    element.x + cx_local * Math.cos(rad1) - cy_local * Math.sin(rad1);
  const global_cy =
    element.y + cx_local * Math.sin(rad1) + cy_local * Math.cos(rad1);

  // Вычисляем новый x, y, чтобы глобальный центр остался тем же самым
  const new_x =
    global_cx - (cx_local * Math.cos(rad2) - cy_local * Math.sin(rad2));
  const new_y =
    global_cy - (cx_local * Math.sin(rad2) + cy_local * Math.cos(rad2));

  // Нормализуем значение rotation для результата: от 0 до 359.99...
  const finalRotation = ((newRotation % 360) + 360) % 360;

  return {
    x: new_x,
    y: new_y,
    rotation: finalRotation,
  };
};
