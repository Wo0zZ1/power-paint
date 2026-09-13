"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui";

import { useNumberInput } from "../lib/hooks";

interface NumberFieldProps extends Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange"
> {
  label?: ReactNode;
  value: number | string;
  modulo?: number;
  isFloat?: boolean;
  requireInteger?: boolean;
  onChange: (v: number) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function NumberField({
  className,
  label,
  value,
  min,
  max,
  modulo,
  isFloat = false,
  onChange,
  onFocus,
  ...props
}: NumberFieldProps) {
  const processedValue =
    value !== "mixed" && !isFloat ? Math.round(Number(value)) : value;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { handleChange } = useNumberInput({
    value: processedValue,
    onChange,
    inputRef,
    min,
    max,
    modulo,
    isFloat,
  });

  const normalizedType = processedValue === "mixed" ? "text" : "number";

  return (
    <div className="flex items-center gap-2">
      {label}

      <Input
        ref={inputRef}
        type={normalizedType}
        defaultValue={processedValue}
        onChange={handleChange}
        onFocus={(e) => {
          e.target.select();
          onFocus?.(e);
        }}
        className={cn(
          "h-8 text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        min={min}
        max={max}
        {...props}
      />
    </div>
  );
}
