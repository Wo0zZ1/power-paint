import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect } from "react";

import type { ElementType } from "./element/types";
import type { AwarenessState, AwarenessUser, RemoteCursorsMap } from "./types";
import { useBoardStore } from "./useBoardStore";

interface UseHocuspocusProps {
  boardId: string;
  user: AwarenessUser;
}

export const useHocuspocus = ({ boardId, user }: UseHocuspocusProps) => {
  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_WS_URL!,
      name: boardId,
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
      provider.awareness?.off("change", onAwarenessChange);
      provider.destroy();
      useBoardStore.getState().reset();
    };
  }, [boardId, user]);
};
