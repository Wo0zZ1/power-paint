import type { ChangeEvent, ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui";

import { FieldLabel } from "./FieldLabel";

export function NumberField({
  label,
  value,
  onChange,
  className,
  ...props
}: {
  label?: string;
  value: number;
  onChange: (v: number) => void;
} & Omit<ComponentProps<typeof Input>, "value" | "onChange">) {
  const [input, setInput] = useState<string>(Math.round(value).toString());

  useEffect(() => {
    setInput(Math.round(value).toString());
  }, [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInput(v);

      const n = Number(v);
      if (!isNaN(n)) return onChange(n);
    },
    [onChange],
  );

  return (
    <div className="grow flex items-center gap-2">
      {label && <FieldLabel label={label} />}

      <Input
        type="number"
        value={input}
        onChange={handleChange}
        className={cn(
          "h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}
