import type { Identity, PublicUser, SessionUser } from "@power-paint/contracts";

import { GET_BASE_API_URL, fetchInitWithCookies } from "@/shared/api";
import { HTTP_UNAUTHORIZED } from "@/shared/constants";

// Личность и профиль принадлежат разным сервисам, поэтому сессия склеивается
// из двух ответов. Второй запрос уходит только при наличии первого.
// null - только когда известно, что пользователь не вошёл. Отказ по лимиту или
// упавший сервис бросают ошибку: иначе вошедшего выбросило бы на страницу входа.
export const fetchSession = async (request: {
  cookieString?: string;
  forwardedFor?: string | null;
}): Promise<SessionUser | null> => {
  const init = fetchInitWithCookies(request);

  const identityResponse = await fetch(
    `${GET_BASE_API_URL()}/auth/me`,
    init,
  );

  if (identityResponse.status === HTTP_UNAUTHORIZED) return null;
  if (!identityResponse.ok) throw new Error("Failed to fetch session");

  const identity: Identity = await identityResponse.json();

  const profileResponse = await fetch(
    `${GET_BASE_API_URL()}/users/${identity.id}`,
    init,
  );

  if (!profileResponse.ok) throw new Error("Failed to fetch profile");

  const profile: PublicUser = await profileResponse.json();

  return { ...profile, role: identity.role };
};

export const signIn = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${GET_BASE_API_URL()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error("auth.errors.invalid_credentials");
};

export const signOut = async () => {
  const response = await fetch(`${GET_BASE_API_URL()}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) throw new Error("errors.unknown_error");
};
