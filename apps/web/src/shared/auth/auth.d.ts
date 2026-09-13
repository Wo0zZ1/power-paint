import type { User as PrismaUser } from "@power-paint/db";

declare module "@auth" {
  type AdapterUser = PrismaUser;
}
