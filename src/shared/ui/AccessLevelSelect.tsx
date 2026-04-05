"use client";

import type { AccessLevel } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import { cn } from "@/utils";

import { ACCESS_LEVELS } from "@/shared/constants";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/shared/ui";

type AccessLevelSelectProps = {
  className?: string;
  access: AccessLevel;
  disabled?: boolean;
  onSelectAccess?: (access: AccessLevel) => void;
} & Pick<ComponentProps<typeof SelectContent>, "side" | "align" | "position">;

export function AccessLevelSelect({
  className,
  disabled,
  access,
  side,
  align,
  position,
  onSelectAccess,
}: AccessLevelSelectProps) {
  const t = useTranslations("access_levels");

  return (
    <Select disabled={disabled} value={access} onValueChange={onSelectAccess}>
      <SelectTrigger className={cn("", className)}>
        <SelectValue>{t(access)}</SelectValue>
      </SelectTrigger>

      <SelectContent side={side} align={align} position={position}>
        {ACCESS_LEVELS.map(({ value, translationKey }) => (
          <SelectItem key={value} value={value}>
            {t(translationKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
