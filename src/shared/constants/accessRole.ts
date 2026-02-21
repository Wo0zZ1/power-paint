export const AccessRole = {
  OWNER: 4,
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
  NONE: 0,
} as const;

export type AccessRole = keyof typeof AccessRole;
export type AccessRoleValue = (typeof AccessRole)[AccessRole];
