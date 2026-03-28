"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui";

import { useNumberInput } from "../lib/hooks";

export function NumberField({
  className,
  label,
  value,
  min,
  max,
  modulo,
  onChange,
  onFocus,
  ...props
}: {
  label?: ReactNode;
  value: number | string;
  modulo?: number;
  onChange: (v: number) => void;
} & Omit<ComponentProps<typeof Input>, "value" | "onChange">) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { handleChange } = useNumberInput({
    value,
    onChange,
    inputRef,
    min,
    max,
    modulo,
  });

  const isMixed = value === "mixed";
  const normalizedType = isMixed ? "text" : "number";

  return (
    <div className="flex items-center gap-2">
      {label}

      <Input
        ref={inputRef}
        type={normalizedType}
        defaultValue={value}
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
