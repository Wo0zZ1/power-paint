import { GET_BASE_API_URL } from "@/shared/api";
import type { SignupCodeData, SignupFormData } from "@/shared/config";

interface ActionResult {
  error: string | null;
  ok: boolean;
}

// Регистрация целиком живёт в сервисе auth: Web только передаёт данные и
// разбирает ответ. Ключ ошибки приходит с сервера и переводится на месте.
const post = async (path: string, body?: unknown): Promise<ActionResult> => {
  const response = await fetch(`${GET_BASE_API_URL()}/auth/signup${path}`, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.ok) return { error: null, ok: true };

  const payload = await response.json().catch(() => null);

  return { error: payload?.message ?? "errors.unknown_error", ok: false };
};

export const SignupAction = (formData: SignupFormData) => post("", formData);

export const VerifySignupAction = (formData: SignupCodeData) =>
  post("/verify", formData);

export const RequestNewCode = () => post("/resend");

export const AbortSignupAction = () => post("/abort");
