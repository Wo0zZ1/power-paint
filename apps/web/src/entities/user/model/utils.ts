import type { User } from "@prisma/client";

import type { PublicUser } from "@/shared/types";

export function getUserPublicInfo(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    created_at: user.created_at,
  };
}
