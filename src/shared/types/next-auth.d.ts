import "next-auth";
import "next-auth/adapters";
import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

export declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: Date | null;
      image: string | null;
      preferredColor: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    role: Role;
  }

  interface Profile {
    email_verified?: Date | boolean;
  }
}

export declare module "next-auth/adapters" {
  interface AdapterUser {
    preferredColor: string;
  }
}
