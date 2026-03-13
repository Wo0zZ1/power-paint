import type { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { Array } from "yjs";

import type { Element } from "./types";

interface UseDragProps {
  elementsRef: RefObject<Array<Element> | null>;
}

type PendingDrag = { id: string; x: number; y: number };

export const useDrag = ({ elementsRef }: UseDragProps) => {
  const rafRef = useRef<number | null>(null);
  const pendingDragRef = useRef<PendingDrag | null>(null);

  const applyDrag = useCallback(() => {
    rafRef.current = null;

    const pending = pendingDragRef.current;
    if (!pending) return;
    pendingDragRef.current = null;

    const yElements = elementsRef.current;
    if (!yElements) return;

    const arr = yElements.toArray();
    const index = arr.findIndex((el) => el.id === pending.id);
    if (index === -1) return;

    yElements.doc?.transact(() => {
      yElements.delete(index);
      yElements.insert(index, [{ ...arr[index], x: pending.x, y: pending.y }]);
    });
  }, [rafRef, elementsRef]);

  const handleDrag = useCallback(
    (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => {
      pendingDragRef.current = {
        id: e.target.attrs.id,
        x: e.target.x(),
        y: e.target.y(),
      };

      if (rafRef.current === null)
        rafRef.current = requestAnimationFrame(applyDrag);
    },
    [applyDrag, rafRef],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [rafRef]);

  return { handleDrag };
};
