"use client";

import type { MemberRole } from "@prisma/client";
import { useTranslations } from "next-intl";

import { MEMBER_ROLES } from "@/shared/constants";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/shared/ui";
import { cn } from "@/utils";

interface MemberRoleSelectProps {
  className?: string;
  role: MemberRole;
  disabled?: boolean;
  onSelectRole?: (role: MemberRole) => void;
}

export function MemberRoleSelect({
  className,
  disabled,
  role,
  onSelectRole,
}: MemberRoleSelectProps) {
  const t = useTranslations();

  return (
    <Select
      disabled={disabled}
      value={role}
      onValueChange={(v: MemberRole) => onSelectRole?.(v)}
    >
      <SelectTrigger className={cn("border-none h-6", className)}>
        <SelectValue>{t(`member_roles.${role}`)}</SelectValue>
      </SelectTrigger>

      <SelectContent side="bottom" align="end" position="item-aligned">
        {MEMBER_ROLES.map(({ value, translationKey }) => (
          <SelectItem key={value} value={value}>
            {t(translationKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
