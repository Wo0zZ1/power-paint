import Konva from "konva";

import {
  createCircle,
  createDraw,
  createImage,
  createRect,
  createText,
  type ElementType,
} from "../types";

import { splitElementsByGroups } from "./grouping";
import {
  getEllipseContourPoints,
  getRectCornerPoints,
  getStrokePoints,
  getTextCornerPoints,
} from "./selection";
import { generateId } from "./utils";

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

export const elementsToImage = async (
  layer: Konva.Layer,
  elements: ElementType[],
  selectedIds: Set<string>,
  options?: {
    mimeType?: "image/png" | "image/jpeg";
    backgroundColor?: string;
  },
): Promise<Blob | null> => {
  if (elements.length === 0 || !layer) return null;

  const offscreenLayer = layer.clone({ listening: false });

  console.log({ offscreenLayer });

  const nodesToRemove: Konva.Node[] = [];
  offscreenLayer.children?.forEach((node) => {
    if (!selectedIds.has(node.id())) {
      nodesToRemove.push(node);
    }
  });
  nodesToRemove.forEach((node) => node.destroy());
  console.log({ nodesToRemove });
  console.log({ offscreenLayer });

  const clientRect = offscreenLayer.getClientRect({ skipTransform: false });

  console.log({ clientRect });

  if (!clientRect || clientRect.width === 0 || clientRect.height === 0) {
    offscreenLayer.destroy();
    return null;
  }

  const padding = 0;
  const width = clientRect.width + padding * 2;
  const height = clientRect.height + padding * 2;

  const mimeType = options?.mimeType || "image/png";

  if (mimeType === "image/jpeg" || options?.backgroundColor) {
    const bgRect = new Konva.Rect({
      x: clientRect.x - padding,
      y: clientRect.y - padding,
      width,
      height,
      fill: options?.backgroundColor || "#ffffff",
    });
    offscreenLayer.add(bgRect);
    bgRect.moveToBottom();
  }

  console.log({ offscreenLayer });

  try {
    const dataURL = offscreenLayer.toDataURL({
      x: clientRect.x - padding,
      y: clientRect.y - padding,
      width,
      height,
      pixelRatio: window.devicePixelRatio || 2,
      mimeType,
    });

    offscreenLayer.destroy();

    const response = await fetch(dataURL);
    return await response.blob();
  } catch (err) {
    console.error("Failed to convert elements to image:", err);
    offscreenLayer.destroy();
    return null;
  }
};

export const duplicateElements = (elements: ElementType[]): ElementType[] => {
  const groupIdMap = new Map<string, string>();

  splitElementsByGroups(elements).forEach((bucket) => {
    if (!bucket.groupId) return;
    groupIdMap.set(bucket.groupId, generateId());
  });

  return elements.map((element) => {
    const groupId = element.groupId
      ? groupIdMap.get(element.groupId)
      : undefined;
    const overrides = {
      ...element,
      groupId,
    };

    switch (element.type) {
      case "image":
        return createImage({ ...overrides, imageUrl: element.imageUrl });
      case "circle":
        return createCircle(overrides);
      case "rect":
        return createRect(overrides);
      case "draw":
        return createDraw(overrides);
      case "text":
        return createText(overrides);
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

    switch (el.type) {
      case "image":
      case "rect":
        points = getRectCornerPoints(el);
        break;
      case "circle":
        points = getEllipseContourPoints(el);
        break;
      case "text":
        points = getTextCornerPoints(el);
        break;
      case "draw":
        points = getStrokePoints(el);
        break;
      default:
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
