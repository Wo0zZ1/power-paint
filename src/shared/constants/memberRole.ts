import { MemberRole } from "@prisma/client";

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
