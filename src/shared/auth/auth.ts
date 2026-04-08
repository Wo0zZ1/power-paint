import NextAuth from "next-auth";
import { cache } from "react";

import { AUTH_CONFIG } from "../config/server";

const { auth: _auth, handlers, signIn, signOut } = NextAuth(AUTH_CONFIG);

export { handlers, signIn, signOut };
export const auth = cache(_auth);
