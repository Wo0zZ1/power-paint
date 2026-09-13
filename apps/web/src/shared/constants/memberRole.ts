import { MemberRole } from "@power-paint/db";

interface MemberRoleItem {
  value: MemberRole;
  translationKey: string;
}

export const MEMBER_ROLES: MemberRoleItem[] = Object.values(MemberRole).map(
  (role) => ({
    value: role,
    translationKey: role,
  }),
);
