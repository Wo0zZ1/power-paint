import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import type * as Y from "yjs";

import type {
  AwarenessState,
  AwarenessUser,
  BoardData,
  Element,
  RemoteCursorsMap,
} from "./types";

interface useHocuspocusProps {
  boardId: string;
  user: AwarenessUser;
}

export const useHocuspocus = ({ boardId, user }: useHocuspocusProps) => {
  const providerRef = useRef<HocuspocusProvider | null>(null);
  const elementsRef = useRef<Y.Array<Element> | null>(null);
  const globalsRef = useRef<Y.Map<unknown> | null>(null);

  const [elements, setElements] = useState<Element[]>();
  const [globals, setGlobals] = useState<BoardData>();
  const [remoteCursors, setRemoteCursors] = useState<RemoteCursorsMap>();

  useEffect(() => {
    const provider = new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: boardId,
    });
    providerRef.current = provider;

    const ydoc = provider.document;
    const yElements = ydoc.getArray<Element>("elements");
    const yGlobals = ydoc.getMap("globals");

    elementsRef.current = yElements;
    globalsRef.current = yGlobals;

    const onElementsChange = () => setElements(yElements.toArray());
    yElements.observe(onElementsChange);
    onElementsChange();

    const onGlobalsChange = () => {
      const bgColor = yGlobals.get("backgroundColor") as string | undefined;
      setGlobals({ backgroundColor: bgColor || "#fff" });
    };
    yGlobals.observe(onGlobalsChange);
    onGlobalsChange();

    // ── Awareness: сообщаем остальным, кто мы

    provider.setAwarenessField("user", user);
    provider.setAwarenessField("cursor", null);

    const onAwarenessChange = () => {
      const states = provider.awareness?.getStates();

      // Убираем себя — нам незачем видеть собственный курсор
      const others = new Map() as RemoteCursorsMap;
      states?.forEach((state, clientId) => {
        if (clientId !== provider.awareness?.clientID)
          others.set(clientId, state as AwarenessState);
      });
      setRemoteCursors(others);
    };

    provider.awareness?.on("change", onAwarenessChange);

    return () => {
      yElements.unobserve(onElementsChange);
      provider.awareness?.off("change", onAwarenessChange);

      provider.destroy();
      providerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  return {
    providerRef,
    elements,
    elementsRef,
    globals,
    globalsRef,
    remoteCursors,
  };
};
