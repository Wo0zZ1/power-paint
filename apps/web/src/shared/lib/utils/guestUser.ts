import { z } from "zod";

import type { IGuestUserCookie } from "@/shared/types";

const guestUserCookieSchema = z.object({
  name: z.tuple([z.string(), z.string()]),
  color: z.string(),
});

export const encodeGuestUserCookie = (guestUser: IGuestUserCookie) =>
  Buffer.from(JSON.stringify(guestUser)).toString("base64");

// Кука приходит от клиента и может оказаться чем угодно: разбор не должен
// ронять страницу, битая кука считается отсутствующей.
export const parseGuestUserCookie = (
  value?: string,
): IGuestUserCookie | null => {
  if (!value) return null;

  try {
    const decoded = Buffer.from(value, "base64").toString();

    return guestUserCookieSchema.safeParse(JSON.parse(decoded)).data ?? null;
  } catch {
    return null;
  }
};
