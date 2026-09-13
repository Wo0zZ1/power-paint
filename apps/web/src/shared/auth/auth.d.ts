import type { User as PrismaUser } from "@prisma/client";

declare module "@auth" {
  type AdapterUser = PrismaUser;
}
