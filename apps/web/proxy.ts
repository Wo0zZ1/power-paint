import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ROUTES } from "@/shared/config";
import {
  GUEST_USER_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
} from "@/shared/constants";
import {
  encodeGuestUserCookie,
  generateRandomUsername,
  generateRandomHexColor,
  parseGuestUserCookie,
} from "@/shared/lib/utils";

const PRIVATE_ROUTES = [ROUTES.DASHBOARD.ROOT] as string[];

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_ID_COOKIE_NAME)?.value;
  if (sessionToken) return NextResponse.next();

  if (PRIVATE_ROUTES.includes(request.nextUrl.pathname))
    return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));

  const guestUser = request.cookies.get(GUEST_USER_COOKIE_NAME)?.value;
  if (parseGuestUserCookie(guestUser)) return NextResponse.next();

  const guestUserCookie = encodeGuestUserCookie({
    name: generateRandomUsername(),
    color: generateRandomHexColor(),
  });

  // Кука кладётся и в сам запрос: страница рендерится в этом же запросе и иначе
  // придумала бы гостю другое имя, чем сохранено в куке.
  request.cookies.set(GUEST_USER_COOKIE_NAME, guestUserCookie);

  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(GUEST_USER_COOKIE_NAME, guestUserCookie);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/public).*)"],
};
