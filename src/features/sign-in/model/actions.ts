"use server";

import { signIn } from "@/shared/auth";
import { ROUTES } from "@/shared/config";
import type { SigninData } from "@/shared/config/authSchemas";

const ERROR_MAP: Record<string, string> = {
  "Invalid data": "errors.invalid_data",
  "Invalid email or password": "errors.invalid_credentials",
};

const mapAuthError = (err: unknown) => {
  if (!err || typeof err !== "object")
    return "errors.invalid_credentials" as const;

  const message = (err as { message?: string }).message;
  const causeMessage = (err as { cause?: { message?: string } }).cause?.message;

  return (
    ERROR_MAP[message ?? ""] ??
    ERROR_MAP[causeMessage ?? ""] ??
    "errors.invalid_credentials"
  );
};

const performSignIn = async (
  provider: "credentials" | "github" | "google",
  options: Record<string, unknown> = {},
) => {
  try {
    const result = await signIn(provider, { ...options, redirect: false });

    if (!result) {
      return { error: "errors.unknown_error", ok: false } as const;
    }
    if (result.error) {
      return {
        error: ERROR_MAP[result.error] ?? "errors.invalid_credentials",
        ok: false,
      } as const;
    }

    return { ok: true as const, url: result.url ?? ROUTES.DASHBOARD.ROOT };
  } catch (err) {
    return { error: mapAuthError(err), ok: false } as const;
  }
};

export const signInWithCredentials = async (data: SigninData) => {
  return performSignIn("credentials", {
    email: data.email,
    password: data.password,
  });
};
