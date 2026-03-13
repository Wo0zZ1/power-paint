import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSession } from "@/shared/lib/auth";
import {
  generateRandomUsername,
  generateRandomColor,
} from "@/shared/lib/utils";
import type { IGuestUserCookie } from "@/shared/types";

export async function proxy() {
  const response = NextResponse.next();

  const cookieState = await cookies();
  const session = await getSession();

  if (!session) {
    const guestUser = cookieState.get("guest-user")?.value;

    if (!guestUser) {
      const guestUserCookie = {
        name: generateRandomUsername(),
        color: generateRandomColor(),
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
  matcher: ["/board/:path*"],
};
