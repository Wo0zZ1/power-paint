import { useCallback } from "react";

import { useBoardStore } from "../core";
import {
  clipboardToElements,
  duplicateElements,
  elementsToClipboard,
  getElements,
  getElementsBounds,
  screenToCanvas,
} from "../lib";
import { type ElementType } from "../types";

export const useCopyPast = () => {
  const duplicate = (elements: ElementType[]) => {
    const { stage, viewport } = useBoardStore.getState();
    if (!stage || elements.length === 0) return;

    const duplicatedElements = duplicateElements(elements);

    const pos = stage.getPointerPosition();
    let shiftX = 20;
    let shiftY = 20;

    if (pos) {
      const [targetX, targetY] = screenToCanvas(pos.x, pos.y, viewport);

      const bounds = getElementsBounds(elements);

      if (bounds) {
        const { minX, minY, maxX, maxY } = bounds;
        const centerX = minX + (maxX - minX) / 2;
        const centerY = minY + (maxY - minY) / 2;

        shiftX = targetX - centerX;
        shiftY = targetY - centerY;
      }
    }

    duplicatedElements.forEach((el) => {
      el.x += shiftX;
      el.y += shiftY;
    });

    const store = useBoardStore.getState();
    store.addElements(duplicatedElements);
    store.setTool("select");
    store.setSelectionType("transform");
    store.pureSelectMany(new Set(duplicatedElements.map((el) => el.id)));
  };

  const handleCopy = useCallback(async () => {
    const { elements, selectedIds, selectionType } = useBoardStore.getState();
    if (selectedIds.size === 0 || selectionType !== "transform") return;

    const selectedElements = getElements(
      Array.from(elements.values()),
      Array.from(selectedIds),
    );

    const json = elementsToClipboard(selectedElements);

    const clipboard = navigator.clipboard;
    await clipboard.writeText(json);
  }, []);

  const handleCopyAsImage = useCallback(async () => {
    const store = useBoardStore.getState();
    if (store.selectedIds.size === 0 || !store.stage) return;

    // TODO: implement copy as image for multiple selection
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardData = await navigator.clipboard.readText();
      if (!clipboardData) return;

      const parsedData = clipboardToElements(clipboardData);
      if (!parsedData) return;

      duplicate(parsedData);
    } catch (err) {
      console.error("Paste failed:", err);
    }
  }, []);

  const handleDuplicate = useCallback(() => {
    const { elements, selectedIds, selectionType } = useBoardStore.getState();
    if (selectedIds.size === 0 || selectionType !== "transform") return;

    const selectedElements = getElements(
      Array.from(elements.values()),
      Array.from(selectedIds),
    );

    duplicate(selectedElements);
  }, []);

  return {
    copy: handleCopy,
    copyAsImage: handleCopyAsImage,
    paste: handlePaste,
    duplicate: handleDuplicate,
  };
};
