import type Konva from "konva";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { Text } from "react-konva";
import { Html } from "react-konva-utils";

import { useInvertableColor } from "@/shared/lib/hooks";

import type { TextElementType } from "../model/types";
import { useBoardStore } from "../model/useBoardStore";

type TextElementProps = {
  element: TextElementType;
  isSelected?: boolean;
} & Omit<ComponentProps<typeof Text>, "id" | "onDblClick" | "onDblTap">;

export function TextElement({ element, ...props }: TextElementProps) {
  const { activeColor } = useInvertableColor(element.textColor);

  const textRef = useRef<Konva.Text>(null);
  const [isEditing, setIsEditing] = useState(false);

  const updateElement = useBoardStore((s) => s.updateElement);

  const handleDblClick = () => {
    setIsEditing(true);
  };

  const handleTextareaRef = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.setSelectionRange(0, el.value.length);
      el.style.height = Math.max(element.height, el.scrollHeight) + "px";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height =
      Math.max(element.height, e.target.scrollHeight) + "px";
    const textValue = e.target.value;
    updateElement(element.id, { text: textValue });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") setIsEditing(false);
  };

  return (
    <>
      <Text
        ref={textRef}
        id={element.id}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        opacity={isEditing ? 0 : element.opacity}
        text={element.text}
        align={element.textAlign}
        verticalAlign={element.textVerticalAlign}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        lineHeight={1.2}
        fill={activeColor}
        hitFunc={(context, shape) => {
          context.beginPath();
          context.rect(0, 0, shape.width(), shape.height());
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
        {...props}
      />
      {isEditing && (
        <Html
          groupProps={{
            x: element.x,
            y: element.y,
            rotation: element.rotation,
          }}
        >
          <textarea
            ref={handleTextareaRef}
            defaultValue={element.text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="resize-none outline-none my-auto border-none p-0 m-0 overflow-hidden bg-transparent leading-[1.2] whitespace-pre-wrap wrap-break-word"
            style={{
              color: activeColor,
              width: element.width,
              fontSize: `${element.fontSize}px`,
              fontFamily: element.fontFamily,
              textAlign: element.textAlign,
            }}
          />
        </Html>
      )}
    </>
  );
}
