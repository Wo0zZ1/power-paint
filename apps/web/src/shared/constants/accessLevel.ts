import { AccessLevel } from "@prisma/client";

interface AccessLevelItem {
  value: AccessLevel;
  translationKey: string;
}

export const ACCESS_LEVELS: AccessLevelItem[] = Object.values(AccessLevel).map(
  (access) => ({ value: access, translationKey: access }),
);
