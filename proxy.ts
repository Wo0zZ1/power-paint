import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ROUTES } from "@/shared/config";
import { SESSION_ID_COOKIE_NAME } from "@/shared/constants";
import {
  generateRandomUsername,
  generateRandomHexColor,
} from "@/shared/lib/utils";
import type { IGuestUserCookie } from "@/shared/types";

const PRIVATE_ROUTES = [ROUTES.DASHBOARD.ROOT, ROUTES.SETTINGS] as string[];
const MANUAL_REDIRECT_TO_DASHBOARD_ROUTES = [
  ROUTES.SIGNIN,
  ROUTES.SIGNUP,
  ROUTES.RESET_PASSWORD,
] as string[];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const [cookieState] = await Promise.all([cookies()]);

  const sessionToken = request.cookies.get(SESSION_ID_COOKIE_NAME)?.value;

  if (!sessionToken) {
    if (PRIVATE_ROUTES.includes(request.nextUrl.pathname)) {
      return redirect(ROUTES.SIGNIN);
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
  } else {
    if (
      MANUAL_REDIRECT_TO_DASHBOARD_ROUTES.includes(request.nextUrl.pathname)
    ) {
      return redirect(ROUTES.DASHBOARD.ROOT);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/public).*)"],
};
