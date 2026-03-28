import { MemberRole } from "@prisma/client";

interface MemberRoleItem {
  value: MemberRole;
  translationKey: string;
}

export const MEMBER_ROLES: MemberRoleItem[] = [
  {
    value: MemberRole.viewer,
    translationKey: "member_roles.viewer",
  },
  {
    value: MemberRole.editor,
    translationKey: "member_roles.editor",
  },
  {
    value: MemberRole.admin,
    translationKey: "member_roles.admin",
  },
];
