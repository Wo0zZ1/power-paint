import "next-auth";
import type { Role } from "@power-paint/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified?: Date;
      image?: string;
      preferredColor?: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    preferredColor?: string;
    role: Role;
  }
}
