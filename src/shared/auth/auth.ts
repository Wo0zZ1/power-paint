import NextAuth from "next-auth";

import { AUTH_CONFIG } from "../config/authConfig";

export const { auth, handlers, signIn, signOut } = NextAuth(AUTH_CONFIG);
