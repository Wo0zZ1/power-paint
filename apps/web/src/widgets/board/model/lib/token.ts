import { encode } from "jwt-simple";
import type { Session } from "next-auth";

import type { AccessRole } from "@/shared/constants";
import { fromDate } from "@/shared/lib/utils";

import type { UserAwareness } from "../types";

interface GenerateWsTokenParams {
  user?: Partial<
    {
      id: Session["user"]["id"];
      email: Session["user"]["email"];
      image: Session["user"]["image"];
    } & UserAwareness
  >;
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
  if (user?.color) payload.color = user.color;
  if (user?.name) payload.name = user.name;
  if (user?.email) payload.email = user.email;
  if (user?.image) payload.image = user.image;

  return encode(payload, secret);
};
