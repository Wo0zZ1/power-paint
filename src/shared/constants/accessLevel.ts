import { AccessLevel } from "@prisma/client";

interface AccessLevelItem {
  value: AccessLevel;
  translationKey: string;
}

export const ACCESS_LEVELS: AccessLevelItem[] = [
  { value: AccessLevel.private, translationKey: "accessLevels.private" },
  {
    value: AccessLevel.public_view,
    translationKey: "accessLevels.public_view",
  },
  {
    value: AccessLevel.public_edit,
    translationKey: "accessLevels.public_edit",
  },
];
