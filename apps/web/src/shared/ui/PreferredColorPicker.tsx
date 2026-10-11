"use client";

import { useTranslations } from "next-intl";

import { DEFAULT_USER_COLORS } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";

import { ColorButton } from "./ColorButton";
import { ColorInput } from "./ColorInput";

interface PreferredColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function PreferredColorPicker({
  value,
  onChange,
  className,
}: PreferredColorPickerProps) {
  const t = useTranslations("auth.fields");

  return (
    <div className={cn("flex flex-wrap justify-between gap-4", className)}>
      <div className="flex gap-x-2">
        {DEFAULT_USER_COLORS.map((color) => (
          <ColorButton
            key={color}
            color={color}
            active={color === value}
            aria-pressed={color === value}
            aria-label={t("preferred_color.option", { color })}
            onSelect={() => onChange(color)}
            invertable
            className="my-auto size-8 outline-2 outline-offset-2 rounded-full"
          />
        ))}
      </div>

      <ColorInput
        preview
        className="h-12 w-min"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
