import { useEffect } from "react";

import { useCopyPast } from "../tools";

import { useBoardStore } from "./useBoardStore";

interface UseHotKeysProps {
  canEdit?: boolean;
}

export const useHotKeys = ({ canEdit = false }: UseHotKeysProps) => {
  const { copy, paste, duplicate } = useCopyPast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement &&
          activeElement.isContentEditable);

      if (e.key === " ") {
        useBoardStore.getState().setModifiers({ space: true });
      } else if (e.key === "Control") {
        useBoardStore.getState().setModifiers({ ctrl: true });
      } else if (e.key === "Shift") {
        useBoardStore.getState().setModifiers({ shift: true });
      }

      if (isInput) return;

      const { setTool, removeSelectedElements, undo, redo } =
        useBoardStore.getState();

      if (e.ctrlKey && e.code === "KeyZ" && canEdit) {
        e.shiftKey ? redo() : undo();
      } else if (e.ctrlKey && e.code === "KeyY" && canEdit) {
        redo();
      } else if (e.ctrlKey && e.code === "KeyC") {
        copy();
      } else if (e.ctrlKey && e.code === "KeyV" && canEdit) {
        paste();
      } else if (e.ctrlKey && e.code === "KeyD" && canEdit) {
        e.preventDefault();
        duplicate();
      } else if ((e.code === "Delete" || e.code === "Backspace") && canEdit) {
        removeSelectedElements();
      } else if (e.code === "KeyS") {
        setTool("select");
      } else if (e.code === "KeyH") {
        setTool("hand");
      } else if (e.code === "KeyR" && canEdit) {
        setTool("rect");
      } else if (e.code === "KeyC" && canEdit) {
        setTool("circle");
      } else if (e.code === "KeyD" && canEdit) {
        setTool("draw");
      } else if (e.code === "KeyE" && canEdit) {
        setTool("eraser");
      } else if (e.code === "KeyT" && canEdit) {
        setTool("text");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ")
        useBoardStore.getState().setModifiers({ space: false });
      if (e.key === "Control")
        useBoardStore.getState().setModifiers({ ctrl: false });
      if (e.key === "Shift")
        useBoardStore.getState().setModifiers({ shift: false });
    };

    const handleBlur = () => {
      useBoardStore
        .getState()
        .setModifiers({ space: false, ctrl: false, shift: false });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      handleBlur();
    };
  }, [canEdit, copy, paste, duplicate]);
};
