import { useCallback } from "react";

import { useBoardStore } from "../core";
import {
  clipboardToElements,
  elementsToImage,
  duplicateElements,
  elementsToClipboard,
  getElements,
  getElementsBounds,
  screenToCanvas,
} from "../lib";
import { type ElementType } from "../types";

export const useCopyPast = () => {
  const duplicate = (
    elements: ElementType[],
    options?: {
      forcedPos?: { x: number; y: number };
      useOffsetOnly?: boolean;
    },
  ) => {
    const { stage, viewport } = useBoardStore.getState();
    if (!stage || elements.length === 0) return;

    const duplicatedElements = duplicateElements(elements);

    const pos = options?.forcedPos || stage.getPointerPosition();
    const useOffsetOnly = options?.useOffsetOnly || false;
    let shiftX = 20;
    let shiftY = 20;

    if (pos && !useOffsetOnly) {
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

  const handleCopyAsImage = useCallback(
    async (format: "png" | "jpeg" = "png") => {
      const store = useBoardStore.getState();
      if (store.selectedIds.size === 0 || !store.contentLayer) return;

      const selectedElements = getElements(
        Array.from(store.elements.values()),
        Array.from(store.selectedIds),
      );

      let backgroundColor = undefined;

      if (format === "jpeg") {
        backgroundColor = "#ffffff"; // fallback
        let currentElement: HTMLElement | null =
          store.stage?.container() || null;
        while (currentElement) {
          const style = window.getComputedStyle(currentElement);
          const bg = style.backgroundColor;
          if (bg && bg !== "transparent") {
            backgroundColor = bg;
            break;
          }
          currentElement = currentElement.parentElement;
        }
      }

      const blob = await elementsToImage(
        store.contentLayer,
        selectedElements,
        store.selectedIds,
        {
          mimeType: "image/png",
          backgroundColor,
        },
      );

      if (blob) {
        try {
          const item = new ClipboardItem({ ["image/png"]: blob });
          await navigator.clipboard.write([item]);
        } catch (err) {
          console.error("Failed to copy image blob to clipboard:", err);
        }
      }
    },
    [],
  );

  const handleExportAsImage = useCallback(
    async (format: "png" | "jpeg" = "png") => {
      const store = useBoardStore.getState();
      if (store.selectedIds.size === 0 || !store.contentLayer) return;

      const selectedElements = getElements(
        Array.from(store.elements.values()),
        Array.from(store.selectedIds),
      );

      let backgroundColor = undefined;
      // Если это jpeg или фон прозрачный - ищем ближайший непрозрачный фон сцены
      if (format === "jpeg") {
        backgroundColor = "#ffffff"; // fallback
        let currentElement: HTMLElement | null =
          store.stage?.container() || null;
        while (currentElement) {
          const style = window.getComputedStyle(currentElement);
          const bg = style.backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            backgroundColor = bg;
            break;
          }
          currentElement = currentElement.parentElement;
        }
      }

      const blob = await elementsToImage(
        store.contentLayer,
        selectedElements,
        store.selectedIds,
        {
          mimeType: format === "jpeg" ? "image/jpeg" : "image/png",
          backgroundColor,
        },
      );

      if (blob) {
        try {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `export.${format}`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Failed to export image:", err);
        }
      }
    },
    [],
  );

  const handlePaste = useCallback(
    async (forcedPos?: { x: number; y: number }) => {
      try {
        const clipboardData = await navigator.clipboard.readText();
        if (!clipboardData) return;

        const parsedData = clipboardToElements(clipboardData);
        if (!parsedData) return;

        duplicate(parsedData, { forcedPos });
      } catch (err) {
        console.error("Paste failed:", err);
      }
    },
    [],
  );

  const handleDuplicate = useCallback(() => {
    const { elements, selectedIds, selectionType } = useBoardStore.getState();
    if (selectedIds.size === 0 || selectionType !== "transform") return;

    const selectedElements = getElements(
      Array.from(elements.values()),
      Array.from(selectedIds),
    );

    duplicate(selectedElements, { useOffsetOnly: true });
  }, []);

  return {
    copy: handleCopy,
    copyAsImage: handleCopyAsImage,
    exportAsImage: handleExportAsImage,
    paste: handlePaste,
    duplicate: handleDuplicate,
  };
};
