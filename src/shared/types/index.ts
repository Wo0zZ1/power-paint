import type { MemberRole, User } from "@prisma/client";

export type IGuestUserCookie = {
  name: [string, string];
  color: string;
};

export type PublicUser = Pick<
  User,
  "id" | "name" | "image" | "email" | "created_at"
>;

export type UserWithRole = { user: PublicUser; role: MemberRole };
