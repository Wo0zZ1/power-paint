import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AccessLevel, Role, WorkspaceType } from "@prisma/client";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { prisma } from "../lib/prisma";

export const AUTH_CONFIG = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      profile(profile) {
        const emailVerified = profile.email_verified ? new Date() : null;

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified,
          image: profile.picture,
          role: Role.User,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,

      profile(profile) {
        const emailVerified = new Date();

        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          emailVerified,
          image: profile.avatar_url,
          role: Role.User,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  cookies: {
    sessionToken: {
      name: "sessionId",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.email = user.email;
      session.user.emailVerified = user.emailVerified;
      session.user.name = user.name;
      session.user.image = user.image ?? null;
      session.user.role = user.role;

      return session;
    },

    async signIn({ user, account }) {
      // Check email verification except for Credentials provider
      if (account?.provider !== "Credentials" && !user.emailVerified) {
        console.error("Email not verified");
        return false;
      }

      return true;
    },
  },

  events: {
    async createUser({ user }) {
      const userWorkspace = await prisma.workspace.findFirst({
        where: {
          ownerId: user.id,
          type: WorkspaceType.personal,
        },
      });
      if (userWorkspace) return;
      try {
        await prisma.workspace.create({
          data: {
            name: `${user.name}'s Workspace`,
            type: WorkspaceType.personal,
            accessLevel: AccessLevel.private,
            ownerId: user.id,
          },
        });
      } catch (error) {
        console.error("Failed to create workspace:", error);
      }
    },

    async linkAccount({ user, profile }) {
      // Update emailVerified if we trust the provier's email verification
      if (!user.emailVerified && profile.emailVerified) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          });
        } catch (error) {
          console.error("Failed to update emailVerified:", error);
        }
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: Date | null;
      image: string | null;
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
