"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

type ElementType = {
  id: string;
  type: "rect" | "circle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
};

interface KonvaBoardProps {
  boardId: string;
}

export function KonvaBoard({ boardId }: KonvaBoardProps) {
  const [elements, setElements] = useState<ElementType[]>([]);
  const ydocRef = useRef<Y.Doc>(undefined);
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Y.Array<ElementType>>(undefined);

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      boardId,
      ydoc,
    );

    const yElements = ydoc.getArray<ElementType>("elements");
    elementsRef.current = yElements;

    // Подписка на изменения массива
    yElements.observe(() => {
      setElements(yElements.toArray());
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [boardId]);

  const addRect = () => {
    const yElements = elementsRef.current;
    if (!yElements) return;
    yElements.push([
      {
        id: crypto.randomUUID(),
        type: "rect",
        x: 50 + Math.random() * 200,
        y: 50 + Math.random() * 200,
        width: 100,
        height: 80,
      },
    ]);
  };

  const addCircle = () => {
    const yElements = elementsRef.current;
    if (!yElements) return;
    yElements.push([
      {
        id: crypto.randomUUID(),
        type: "circle",
        x: 50 + Math.random() * 200,
        y: 50 + Math.random() * 200,
        radius: 50,
      },
    ]);
  };

  const handleDrag = (id: string, x: number, y: number) => {
    const yElements = elementsRef.current;
    if (!yElements) return;

    const arr = yElements.toArray();
    const index = arr.findIndex((el) => el.id === id);
    if (index === -1) return;

    yElements.delete(index);
    yElements.insert(index, [{ ...arr[index], x, y }]);
  };

  return (
    <div ref={boardRef} className="w-full h-full">
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={addCircle}>Add Circle</button>

      <Stage
        height={500}
        width={500}
        // className="w-full h-full"
        style={{ border: "1px solid black" }}
      >
        <Layer>
          {elements.map((el) => {
            if (el.type === "rect") {
              return (
                <Rect
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width!}
                  height={el.height!}
                  fill="lightblue"
                  draggable
                  onDragMove={(e) =>
                    handleDrag(el.id, e.target.x(), e.target.y())
                  }
                />
              );
            }
            if (el.type === "circle") {
              return (
                <Circle
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  radius={el.radius!}
                  fill="pink"
                  draggable
                  onDragMove={(e) =>
                    handleDrag(el.id, e.target.x(), e.target.y())
                  }
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
