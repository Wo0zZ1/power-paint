import { encode } from "jwt-simple";
import type { Session } from "next-auth";

import type { AccessRole } from "@/shared/constants";
import { fromDate } from "@/shared/lib/utils";

interface GenerateWsTokenParams {
  user?: Session["user"];
  accessRole: AccessRole;
}

export const generateWsToken = async ({
  user,
  accessRole,
}: GenerateWsTokenParams) => {
  const secret = process.env.WS_TOKEN_SECRET;
  if (!secret)
    throw new Error("WS_TOKEN_SECRET is not set in environment variables");

  const payload: Record<string, unknown> = {
    accessRole,
    exp: fromDate(1 * 60 * 1000),
  };
  if (user?.id) payload.sub = user.id;
  if (user?.name) payload.name = user.name;
  if (user?.email) payload.email = user.email;
  if (user?.image) payload.image = user.image;

  return encode(payload, secret);
};
