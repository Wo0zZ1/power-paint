import { Hash, Pipette } from "lucide-react";
import type { FocusEventHandler } from "react";
import { useEffect, useRef } from "react";

import { hexValueToInputValue, normalizeHexColor } from "@/shared/lib/utils";
import {
  Separator,
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/shared/ui";

import { useHexColorInput } from "../model/useHexColorInput";

import { ColorSwatch } from "./ColorSwatch";
import { FieldLabel } from "./FieldLabel";

interface ColorFieldProps {
  id?: string;
  label?: string;
  value: string;
  exceptionValue?: string;
  onChange: (value: string) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  className?: string;
  preview?: boolean;
}

export function ColorField({
  id,
  label,
  value,
  exceptionValue,
  onChange,
  onFocus,
  className,
  preview = false,
}: ColorFieldProps) {
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const {
    inputValue,
    setInputValue,
    isValid,
    handleInputChange,
    handlePickerChange,
  } = useHexColorInput({ value, onChange });

  // TODO: Refactor Cascade Rendering
  const inputValueRef = useRef(inputValue);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  useEffect(() => {
    const normalizedInputValue = normalizeHexColor(inputValueRef.current);

    if (value !== normalizedInputValue)
      setInputValue(hexValueToInputValue(value));
  }, [value, setInputValue]);

  return (
    <div className="flex items-center gap-2">
      {label && <FieldLabel label={label} />}

      <InputGroup className={className}>
        <InputGroupAddon align="inline-start">
          {preview && (
            <ColorSwatch
              className="size-5 rounded-sm"
              color={value}
              invertable
            />
          )}
          <Hash className="size-3.5" />
        </InputGroupAddon>

        <InputGroupInput
          id={id}
          autoComplete="off"
          type="text"
          maxLength={6}
          value={inputValue}
          aria-invalid={inputValue !== exceptionValue && !isValid}
          className={
            "invalid:border-destructive focus:invalid:ring-destructive font-mono min-w-16"
          }
          onChange={handleInputChange}
          onFocus={(e) => {
            e.target.select();
            onFocus?.(e);
          }}
        />

        <InputGroupAddon className="gap-1" align="inline-end">
          <Separator orientation="vertical" className="h-5!" />
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            onClick={() => colorPickerRef.current?.click()}
          >
            <Pipette className="size-3.5" />
          </InputGroupButton>
          <input
            ref={colorPickerRef}
            type="color"
            value={value}
            onChange={handlePickerChange}
            className="sr-only"
            aria-hidden
            tabIndex={-1}
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
