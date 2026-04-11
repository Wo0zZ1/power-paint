export const VERIFICATION_COOKIE = "signupVerificationId";
export const VERIFICATION_TTL_MS = 15 * 60 * 1000;
export const VERIFICATION_COOKIE_SETTINGS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: false && process.env.NODE_ENV === "production", // TODO: Вынести в env
  maxAge: Math.floor(VERIFICATION_TTL_MS / 1000),
} as const;
export const MAX_VERIFICATION_ATTEMPTS = 5;

export const RESET_PASSWORD_COOKIE = "resetPasswordToken";
export const RESET_PASSWORD_TTL_MS = VERIFICATION_TTL_MS;
export const RESET_PASSWORD_COOKIE_SETTINGS = VERIFICATION_COOKIE_SETTINGS;
export const MAX_RESET_PASSWORD_ATTEMPTS = MAX_VERIFICATION_ATTEMPTS;

export const SESSION_ID_COOKIE_NAME = "sessionId";
