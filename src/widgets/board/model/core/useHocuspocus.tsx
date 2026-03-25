import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect } from "react";
import { UndoManager } from "yjs";

import { DEFAULT_CAPTURE_TIMEOUT } from "@/shared/config";

import type {
  AwarenessUser,
  RemoteCursorsMap,
  AwarenessState,
  ElementType,
} from "../types";

import { useBoardStore } from "./useBoardStore";

interface UseHocuspocusProps {
  user: AwarenessUser;
  accessToken: string;
  boardId: string;
}

export const useHocuspocus = ({
  user,
  accessToken,
  boardId,
}: UseHocuspocusProps) => {
  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_WS_URL!,
      name: boardId,
      token: accessToken,
    });

    const ydoc = provider.document;
    const yElements = ydoc.getMap<ElementType>("elements");
    const yGlobals = ydoc.getMap("globals");

    // Сохраняем Yjs-ссылки в стор
    useBoardStore.setState({ provider, yElements, yGlobals });

    // ── Синхронизация элементов ──
    const onElementsChange = () => {
      useBoardStore.setState({ elements: new Map(yElements) });
    };
    yElements.observe(onElementsChange);
    onElementsChange();

    // ── Синхронизация глобальных настроек ──
    const onGlobalsChange = () => {
      const bg = yGlobals.get("backgroundColor") as string | undefined;
      useBoardStore.setState({
        globals: { backgroundColor: bg || "#ffffff" },
      });
    };
    yGlobals.observe(onGlobalsChange);
    onGlobalsChange();

    // ── Awareness: сообщаем остальным, кто мы ──
    provider.setAwarenessField("user", user);
    provider.setAwarenessField("cursor", null);

    // ── Undo / Redo ──
    const undoManager = new UndoManager([yElements, yGlobals], {
      captureTimeout: DEFAULT_CAPTURE_TIMEOUT,
    });

    const updateUndoRedoState = () => {
      useBoardStore.setState({
        canUndo: undoManager.undoStack.length > 0,
        canRedo: undoManager.redoStack.length > 0,
      });
    };

    undoManager.on("stack-item-added", updateUndoRedoState);
    undoManager.on("stack-item-popped", updateUndoRedoState);
    useBoardStore.setState({ undoManager });

    const onAwarenessChange = () => {
      const states = provider.awareness?.getStates();

      const others = new Map() as RemoteCursorsMap;
      states?.forEach((state, clientId) => {
        if (clientId !== provider.awareness?.clientID)
          others.set(clientId, state as AwarenessState);
      });
      useBoardStore.setState({ remoteCursors: others });
    };
    provider.awareness?.on("change", onAwarenessChange);

    return () => {
      yElements.unobserve(onElementsChange);
      yGlobals.unobserve(onGlobalsChange);
      undoManager.off("stack-item-added", updateUndoRedoState);
      undoManager.off("stack-item-popped", updateUndoRedoState);
      undoManager.destroy();
      provider.awareness?.off("change", onAwarenessChange);
      provider.destroy();
      useBoardStore.getState().reset();
    };
  }, [boardId, user, accessToken]);
};
