import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ROUTES } from "@/shared/config";
import { SESSION_ID_COOKIE_NAME } from "@/shared/constants";
import {
  generateRandomUsername,
  generateRandomHexColor,
} from "@/shared/lib/utils";
import type { IGuestUserCookie } from "@/shared/types";

const PRIVATE_ROUTES = [ROUTES.DASHBOARD.ROOT] as string[];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const [cookieState] = await Promise.all([cookies()]);

  const sessionToken = request.cookies.get(SESSION_ID_COOKIE_NAME)?.value;

  if (!sessionToken) {
    if (PRIVATE_ROUTES.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
    }

    const guestUser = cookieState.get("guest-user")?.value;

    if (!guestUser) {
      const guestUserCookie = {
        name: generateRandomUsername(),
        color: generateRandomHexColor(),
      } satisfies IGuestUserCookie;

      response.cookies.set(
        "guest-user",
        Buffer.from(JSON.stringify(guestUserCookie)).toString("base64"),
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/public).*)"],
};
