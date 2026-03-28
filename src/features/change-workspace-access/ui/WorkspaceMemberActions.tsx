"use client";

import type { MemberRole } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { MEMBER_ROLES } from "@/shared/constants";
import type { PublicUser } from "@/shared/types";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Select,
} from "@/shared/ui";

interface WorkspaceMemberActionsProps {
  disabled?: boolean;
  member: { user: PublicUser; role: MemberRole };
  onChangeMemberRole?: (userId: string, newRole: MemberRole) => void;
  onRemoveMember?: (user: PublicUser) => void;
}

export function WorkspaceMemberActions({
  member,
  disabled = false,
  onChangeMemberRole,
  onRemoveMember,
}: WorkspaceMemberActionsProps) {
  const t = useTranslations();

  return (
    <>
      <Select
        disabled={disabled}
        value={member.role}
        onValueChange={(v: MemberRole) =>
          onChangeMemberRole?.(member.user.id, v)
        }
      >
        <SelectTrigger className="bg-transparent! border-none h-6">
          <SelectValue>{t(`member_roles.${member.role}`)}</SelectValue>
        </SelectTrigger>

        <SelectContent side="bottom" align="center" position="popper">
          {MEMBER_ROLES.map(({ value, translationKey }) => (
            <SelectItem key={value} value={value}>
              {t(translationKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        disabled={disabled}
        variant="destructive"
        type="button"
        size="icon-sm"
        onClick={() => onRemoveMember?.(member.user)}
      >
        <Trash2 className="size-4" />
      </Button>
    </>
  );
}
