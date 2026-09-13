import type { ComponentProps } from "react";
import { Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useShallow } from "zustand/react/shallow";

import { useInvertableColor } from "@/shared/lib/hooks";

import type { TextElementType } from "../../model";
import {
  useBoardStore,
  getOpacity,
  getTextHitFunc,
  useTextEditing,
} from "../../model";

type TextElementProps = {
  element: TextElementType;
  canEdit: boolean;
} & ComponentProps<typeof Text>;

export function TextElement({ element, canEdit, ...props }: TextElementProps) {
  const selectedIds = useBoardStore(useShallow((s) => s.selectedIds));
  const selectionType = useBoardStore((s) => s.selectionType);
  const isSelected = selectedIds.has(element.id);

  const opacity = getOpacity(element.opacity, isSelected, selectionType);

  const hitFunc = getTextHitFunc();

  const {
    textRef,
    isEditing,
    handleDblClick,
    handleTextareaRef,
    handleChange,
    handleBlur,
    handleKeyDown,
  } = useTextEditing(element, canEdit);

  const { activeColor: textColor } = useInvertableColor(element.textColor);

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
        opacity={opacity}
        visible={!isEditing}
        text={element.text}
        align={element.textAlign}
        verticalAlign={element.textVerticalAlign}
        fontSize={element.fontSize}
        fontFamily={element.fontFamily}
        lineHeight={1.2}
        fill={textColor}
        hitFunc={hitFunc}
        onPointerDblClick={handleDblClick}
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
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            defaultValue={element.text}
            autoFocus
            className="resize-none outline-none my-auto border-none p-0 m-0 overflow-hidden bg-transparent leading-[1.2] whitespace-pre-wrap wrap-break-word"
            style={{
              color: textColor,
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
