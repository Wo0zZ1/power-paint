import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { ROUTES } from "@/shared/config";
import { getSession } from "@/shared/lib/auth";

// const PRIVATE_ROUTES = ["/dashboard"];

export function proxy(request: Request) {
  // const response = NextResponse.next();
  // const session = getSession();
  // if (!session && PRIVATE_ROUTES.some((route) => request.url.includes(route)))
  //   redirect(ROUTES.LOGIN);
  // return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
