"use client";

import type { MemberRole } from "@prisma/client";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import { cn } from "@/utils";

import { MEMBER_ROLES } from "@/shared/constants";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/shared/ui";

type MemberRoleSelectProps = {
  className?: string;
  role: MemberRole;
  disabled?: boolean;
  onSelectRole?: (role: MemberRole) => void;
} & Pick<ComponentProps<typeof SelectContent>, "side" | "align" | "position">;

export function MemberRoleSelect({
  className,
  disabled,
  role,
  side,
  align,
  position,
  onSelectRole,
}: MemberRoleSelectProps) {
  const t = useTranslations("member_roles");

  return (
    <Select
      disabled={disabled}
      value={role}
      onValueChange={(v: MemberRole) => onSelectRole?.(v)}
    >
      <SelectTrigger className={cn("", className)}>
        <SelectValue>{t(role)}</SelectValue>
      </SelectTrigger>

      <SelectContent side={side} align={align} position={position}>
        {MEMBER_ROLES.map(({ value, translationKey }) => (
          <SelectItem key={value} value={value}>
            {t(translationKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
