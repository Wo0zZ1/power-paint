import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui";

import { useNumberInput } from "../model/useNumberInput";

import { FieldLabel } from "./FieldLabel";

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
  label?: string;
  value: number | string;
  modulo?: number;
  onChange: (v: number) => void;
} & Omit<ComponentProps<typeof Input>, "value" | "onChange">) {
  const { inputValue, handleChange } = useNumberInput({
    value,
    onChange,
    min,
    max,
    modulo,
  });

  return (
    <div className="grow flex items-center gap-2">
      {label && <FieldLabel label={label} />}

      <Input
        type={typeof value === "string" ? "text" : "number"}
        value={inputValue}
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
