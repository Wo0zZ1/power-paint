import type { Context, onAuthenticatePayload } from "@hocuspocus/server";
import { decode } from "jwt-simple";
import { WS_TOKEN_SECRET } from "../config";

export const throwUnauthorized = () => {
  throw new Error("Unauthorized");
};

type AccessRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER" | "NONE";

declare module "@hocuspocus/server" {
  export interface Context {
    accessRole: AccessRole;
  }
}

interface WsTokenPayload {
  accessRole: AccessRole;
  exp: string;
  sub?: string;
  name?: string;
  email?: string;
  image?: string;
}

export async function onAuthenticate({
  token,
  connectionConfig,
}: onAuthenticatePayload): Promise<Context> {
  try {
    const data = decode(token, WS_TOKEN_SECRET) as WsTokenPayload;

    if (new Date(data.exp) < new Date()) throwUnauthorized();

    if (data.accessRole === "NONE") throwUnauthorized();

    if (data.accessRole === "VIEWER") connectionConfig.readOnly = true;

    return { accessRole: data.accessRole };
  } catch {
    return throwUnauthorized();
  }
}
