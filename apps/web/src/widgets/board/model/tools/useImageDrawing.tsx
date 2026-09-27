import type { KonvaEventObject } from "konva/lib/Node";
import type { RefObject } from "react";
import { useCallback, useRef } from "react";

import { useUploadThing } from "@/shared/lib/uploadthing";

import { useBoardStore } from "../core";
import { screenToCanvas } from "../lib";
import { insertImageFromFile } from "../lib";

const createInput = (ref: RefObject<HTMLInputElement | null>) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";
  document.body.appendChild(input);
  ref.current = input;
  return input;
};

const removeInput = (ref: RefObject<HTMLInputElement | null>) => {
  if (!ref.current) return;
  document.body.removeChild(ref.current);
  ref.current = null;
};

export const useImageDrawing = () => {
  const originRef = useRef({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { startUpload } = useUploadThing("canvasImageUploader");

  const requestImage = useCallback(() => {
    const input = createInput(inputRef);
    input.click();

    const handleUpload = () => {
      const file = inputRef.current?.files?.[0];
      if (!file) return;

      input.removeEventListener("change", handleUpload);
      input.removeEventListener("cancel", handleAbort);
      removeInput(inputRef);

      void insertImageFromFile(file, {
        position: originRef.current,
        startUpload,
      });
    };

    const handleAbort = () => {
      input.removeEventListener("change", handleUpload);
      input.removeEventListener("cancel", handleAbort);
      removeInput(inputRef);
    };

    input.addEventListener("change", handleUpload, { once: true });
    input.addEventListener("cancel", handleAbort, { once: true });
  }, [startUpload]);

  const beginDraw = useCallback(
    (layerX: number, layerY: number) => {
      const { viewport } = useBoardStore.getState();

      const [cx, cy] = screenToCanvas(layerX, layerY, viewport);
      originRef.current = { x: cx, y: cy };

      requestImage();
    },
    [requestImage],
  );

  const containerRectRef = useRef<DOMRect | null>(null);

  const startPointerImageDraw = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (e.evt.pointerType === "touch") return;

      const stage = e.target.getStage();
      if (!stage) return;

      const rect = stage.container().getBoundingClientRect();
      containerRectRef.current = rect;

      beginDraw(e.evt.clientX - rect.left, e.evt.clientY - rect.top);
    },
    [beginDraw],
  );

  const startTouchImageDraw = useCallback(
    (e: KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches[0];
      if (!touch) return;

      const stage = e.target.getStage();
      if (!stage) return;

      const rect = stage.container().getBoundingClientRect();
      containerRectRef.current = rect;

      beginDraw(touch.clientX - rect.left, touch.clientY - rect.top);
    },
    [beginDraw],
  );

  return {
    startPointerImageDraw,
    startTouchImageDraw,
  };
};
