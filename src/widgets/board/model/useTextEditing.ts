import type Konva from "konva";
import { useRef, useState, useCallback } from "react";

import type { TextElementType } from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

export function useTextEditing(element: TextElementType) {
  const textRef = useRef<Konva.Text>(null);
  const [isEditing, setIsEditing] = useState(false);
  const updateElement = useBoardStore((s) => s.updateElement);

  const handleDblClick = useCallback(() => {
    const activeTool = useBoardStore.getState().tool;
    if (activeTool !== "select") return;
    setIsEditing(true);
  }, []);

  const handleTextareaRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (el) {
        el.setSelectionRange(0, el.value.length);
        el.style.height = Math.max(element.height, el.scrollHeight) + "px";
      }
    },
    [element.height],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.target.style.height = "auto";
      e.target.style.height =
        Math.max(element.height, e.target.scrollHeight) + "px";
      const textValue = e.target.value;
      updateElement(element.id, { text: textValue });
    },
    [element.height, element.id, updateElement],
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") setIsEditing(false);
    },
    [],
  );

  return {
    textRef,
    isEditing,
    setIsEditing,
    handleDblClick,
    handleTextareaRef,
    handleChange,
    handleBlur,
    handleKeyDown,
  };
}
