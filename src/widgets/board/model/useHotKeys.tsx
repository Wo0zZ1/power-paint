import { useEffect } from "react";

import { useBoardStore } from "./useBoardStore";

export const useHotKeys = () => {
  useEffect(() => {
    const isInput = () => {
      const el = document.activeElement;
      return (
        el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Модификаторы - отслеживаем всегда (даже в input)
      if (e.key === " ") {
        e.preventDefault();
        useBoardStore.setState({
          modifiers: { ...useBoardStore.getState().modifiers, space: true },
        });
        return;
      }
      if (e.key === "Control") {
        useBoardStore.setState({
          modifiers: { ...useBoardStore.getState().modifiers, ctrl: true },
        });
        return;
      }
      if (e.key === "Shift") {
        useBoardStore.setState({
          modifiers: { ...useBoardStore.getState().modifiers, shift: true },
        });
        return;
      }

      if (isInput()) return;

      const { setTool, resetViewport, removeSelectedElements, undo, redo } =
        useBoardStore.getState();

      switch (e.code) {
        // Undo / Redo
        case "KeyZ":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) redo();
            else undo();
          }
          break;
        case "KeyY":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            redo();
          }
          break;
        // Удаление выделенных элементов
        case "Delete":
        case "Backspace":
          e.preventDefault();
          removeSelectedElements();
          break;
        // Инструменты
        case "KeyS":
          setTool("select");
          break;
        case "KeyH":
          setTool("hand");
          break;
        case "KeyR":
          setTool("rect");
          break;
        case "KeyC":
          setTool("circle");
          break;
        case "KeyD":
          setTool("draw");
          break;
        case "KeyE":
          setTool("eraser");
          break;
        case "KeyT":
          setTool("text");
          break;
        // Сброс зума и позиции
        case "Digit0":
          if (e.ctrlKey || e.metaKey) resetViewport();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        useBoardStore.setState({
          modifiers: { ...useBoardStore.getState().modifiers, space: false },
        });
      }
      if (e.key === "Control") {
        useBoardStore.setState({
          modifiers: { ...useBoardStore.getState().modifiers, ctrl: false },
        });
      }
      if (e.key === "Shift") {
        useBoardStore.setState({
          modifiers: { ...useBoardStore.getState().modifiers, shift: false },
        });
      }
    };

    const handleBlur = () => {
      useBoardStore.setState({
        modifiers: { space: false, ctrl: false, shift: false },
      });
    };

    window.addEventListener("keypress", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keypress", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);

      handleBlur();
    };
  }, []);
};
