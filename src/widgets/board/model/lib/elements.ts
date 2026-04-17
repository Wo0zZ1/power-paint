import type Konva from "konva";

import {
  createCircle,
  createDraw,
  createRect,
  createText,
  type ElementType,
} from "../types";

import {
  getEllipseContourPoints,
  getRectCornerPoints,
  getStrokePoints,
  getTextCornerPoints,
} from "./selection";

export const getKonvaNodesFromLayer = (
  layer: Konva.Layer,
  ids: string[],
): Konva.Node[] => {
  return ids
    .map((id) => layer.findOne(`#${id}`))
    .filter((node) => !!node) as Konva.Node[];
};

export const getElements = (
  elements: ElementType[],
  ids: string[],
): ElementType[] => {
  return elements.filter((element) => ids.includes(element.id));
};

export const elementsToClipboard = (elements: ElementType[]): string => {
  return JSON.stringify({
    type: "power-paint-clipboard",
    elements,
  });
};

export const clipboardToElements = (
  clipboard: string,
): ElementType[] | null => {
  try {
    const parsed = JSON.parse(clipboard);
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.type === "power-paint-clipboard" &&
      Array.isArray(parsed.elements) &&
      parsed.elements.length > 0
    ) {
      return parsed.elements;
    }
  } catch {
    const textElement = createText({
      x: 0,
      y: 0,
      text: clipboard,
      fontSize: 24,
    });
    return [textElement];
  }
  return null;
};

export const duplicateElements = (elements: ElementType[]): ElementType[] => {
  return elements.map((element) => {
    switch (element.type) {
      case "circle":
        return createCircle(element);
      case "rect":
        return createRect(element);
      case "draw":
        return createDraw(element);
      case "text":
        return createText(element);
      default:
        const _: never = element;
        return _;
    }
  });
};

export const getElementsBounds = (
  elements: ElementType[],
): { minX: number; minY: number; maxX: number; maxY: number } | null => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    let elMinX = el.x;
    let elMinY = Infinity;
    let elMaxX = -Infinity;
    let elMaxY = -Infinity;

    let points: { x: number; y: number }[] = [];

    if (el.type === "rect") {
      points = getRectCornerPoints(el);
    } else if (el.type === "circle") {
      points = getEllipseContourPoints(el);
    } else if (el.type === "text") {
      points = getTextCornerPoints(el);
    } else if (el.type === "draw") {
      points = getStrokePoints(el);
    } else {
      const _: never = el;
    }

    if (points.length === 0) {
      elMinX = el.x;
      elMinY = el.y;
      elMaxX = el.x;
      elMaxY = el.y;
    } else {
      for (const p of points) {
        elMinX = Math.min(elMinX, p.x);
        elMinY = Math.min(elMinY, p.y);
        elMaxX = Math.max(elMaxX, p.x);
        elMaxY = Math.max(elMaxY, p.y);
      }
    }

    minX = Math.min(minX, elMinX);
    minY = Math.min(minY, elMinY);
    maxX = Math.max(maxX, elMaxX);
    maxY = Math.max(maxY, elMaxY);
  });

  if (minX === Infinity) {
    return null;
  }

  return { minX, minY, maxX, maxY };
};
