"use client";

import type { MemberRole } from "@prisma/client";
import { CornerDownLeft } from "lucide-react";

import { Kbd, Separator } from "@/shared/ui";

import { MemberRoleSelect } from "./MemberRoleSelect";

interface ComboboxAddonProps {
  disabled?: boolean;
  role: MemberRole;
  setDefaultRole: (role: MemberRole) => void;
}

export function ComboboxAddon({
  disabled,
  role,
  setDefaultRole,
}: ComboboxAddonProps) {
  return (
    <>
      <MemberRoleSelect
        disabled={disabled}
        role={role}
        onSelectRole={setDefaultRole}
      />

      <Separator orientation="vertical" className="mx-1 h-6! bg-border" />

      <Kbd>
        <CornerDownLeft className="size-4 p-px" />
      </Kbd>
    </>
  );
}
