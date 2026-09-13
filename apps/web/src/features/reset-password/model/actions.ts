import { GET_BASE_API_URL } from "@/shared/api";
import type {
  ForgotPasswordData,
  ResetPasswordData,
  SignupCodeData,
} from "@/shared/config";

interface ActionResult {
  error: string | null;
  ok: boolean;
}

const post = async (path: string, body?: unknown): Promise<ActionResult> => {
  const response = await fetch(
    `${GET_BASE_API_URL()}/auth/reset-password${path}`,
    {
      method: "POST",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    },
  );

  if (response.ok) return { error: null, ok: true };

  const payload = await response.json().catch(() => null);

  return { error: payload?.message ?? "errors.unknown_error", ok: false };
};

export const RequestPasswordResetAction = (formData: ForgotPasswordData) =>
  post("", formData);

export const VerifyPasswordResetCodeAction = (formData: SignupCodeData) =>
  post("/verify", formData);

export const RequestNewCode = () => post("/resend");

export const UpdatePasswordAction = (formData: ResetPasswordData) =>
  post("/confirm", formData);

export const AbortPasswordResetAction = () => post("/abort");
