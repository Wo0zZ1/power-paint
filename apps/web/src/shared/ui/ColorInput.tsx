"use client";

import { Hash, Pipette } from "lucide-react";
import type { ComponentProps, FocusEventHandler } from "react";
import { memo, useRef } from "react";

import {
  Separator,
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  ColorSwatch,
} from "@/shared/ui";

import { useColorInput } from "../lib/hooks";
import { hexColorRegex } from "../lib/utils";

interface ColorFieldProps {
  onChange: (value: string) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  className?: string;
  value: string;
  exceptionValues?: string[];
  preview?: boolean;
  showInput?: boolean;
}

function Component({
  onChange,
  onFocus,
  className,
  value,
  exceptionValues,
  preview = false,
  showInput = true,
  ...props
}: ColorFieldProps & Omit<ComponentProps<"input">, keyof ColorFieldProps>) {
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const {
    defaultValue,
    isValid,
    handleInputChange,
    handlePickerChange,
    handleInputBlur,
  } = useColorInput({
    colorInputRef,
    value,
    exceptionValues,
    onChange,
  });

  return (
    <InputGroup className={className}>
      <InputGroupAddon align="inline-start">
        {preview && (
          <ColorSwatch
            className="size-5 rounded-sm"
            color={hexColorRegex.test(value) ? value : "#000000"}
            invertable
          />
        )}
        {showInput && <Hash className="size-3.5" />}
      </InputGroupAddon>

      {showInput && (
        <InputGroupInput
          ref={colorInputRef}
          autoComplete="off"
          type="text"
          maxLength={6}
          aria-invalid={!isValid}
          defaultValue={defaultValue}
          className="invalid:border-destructive focus:invalid:ring-destructive font-mono min-w-16"
          onChange={handleInputChange}
          onFocus={(e) => {
            e.target.select();
            onFocus?.(e);
          }}
          onBlur={handleInputBlur}
          {...props}
        />
      )}

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
          value={hexColorRegex.test(value) ? value : "#000000"}
          onChange={handlePickerChange}
          className="sr-only"
          aria-hidden
          tabIndex={-1}
        />
      </InputGroupAddon>
    </InputGroup>
  );
}

Component.displayName = "ColorInput";

export const ColorInput = memo(Component);
