import type { MemberRole, User } from "@prisma/client";

export type PublicUser = Pick<
  User,
  "id" | "name" | "image" | "email" | "created_at"
>;

export type UserWithRole = { user: PublicUser; role: MemberRole };
