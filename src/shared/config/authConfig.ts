import { PrismaAdapter } from "@auth/prisma-adapter";
import { AccessLevel, Role, WorkspaceType } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import z from "zod";

import { SESSION_ID_COOKIE_NAME } from "../constants";
import { prisma } from "../lib/prisma";
import { compareHash } from "../lib/server";

import { getSigninSchema } from "./authSchemas";
import { ROUTES } from "./routes";

export const AUTH_CONFIG = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email.toLowerCase(),
          emailVerified: new Date(),

          image: profile.picture,
          role: Role.User,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),

    Github({
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email!.toLowerCase(),
          emailVerified: new Date(),

          image: profile.avatar_url,
          role: Role.User,
        };
      },

      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const validatedUser = z.safeParse(getSigninSchema(), credentials);
        if (!validatedUser.success) return null;

        const { email, password } = validatedUser.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = compareHash(password, user.password);

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: new Date(),
          image: user.image ?? undefined,
          preferredColor: user.preferredColor,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: ROUTES.SIGNIN,
    error: ROUTES.SIGNIN,
    newUser: ROUTES.DASHBOARD.ROOT,
  },

  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  cookies: {
    sessionToken: {
      name: SESSION_ID_COOKIE_NAME,
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
      session.user.name = user.name;
      session.user.image = user.image;
      session.user.preferredColor = user.preferredColor;
      session.user.role = user.role;

      return session;
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
            ownerId: user.id,
            name: `${user.name}'s Workspace`,
            type: WorkspaceType.personal,
            accessLevel: AccessLevel.private,
          },
        });
      } catch (error) {
        console.error("Failed to create workspace:", error);
      }
    },

    async linkAccount({ user, profile }) {
      const image = profile.image;

      await prisma.user.update({
        where: { id: user.id },
        data: { image },
      });
    },
  },

  debug: false,
} satisfies NextAuthConfig;
