import type { OwnProfile, ProfileSettingsData } from "@power-paint/contracts";
import type { Locale } from "@power-paint/db";

import { GET_BASE_API_URL, fetchInitWithCookies } from "@/shared/api";
import type { PublicUser } from "@/shared/types";

const url = GET_BASE_API_URL() + "/users";

const getAllUsers = async ({ query }: { query?: string } = {}): Promise<
  PublicUser[]
> => {
  const params = new URLSearchParams();
  if (query) params.set("query", query);

  const response = await fetch(
    `${url}?${params.toString()}`,
    fetchInitWithCookies(),
  );

  if (!response.ok) throw new Error("Failed to fetch users");

  return response.json();
};

const fetchUser = async ({
  userId,
  cookieString,
}: {
  userId: string;
  cookieString?: string;
}): Promise<PublicUser> => {
  const response = await fetch(
    `${url}/${userId}`,
    fetchInitWithCookies({ cookieString }),
  );

  if (!response.ok) throw new Error("Failed to fetch user");

  return response.json();
};

const fetchOwnProfile = async ({
  cookieString,
}: { cookieString?: string } = {}): Promise<OwnProfile> => {
  const response = await fetch(
    `${url}/me`,
    fetchInitWithCookies({ cookieString }),
  );

  if (!response.ok) throw new Error("Failed to fetch own profile");

  return response.json();
};

const updateProfile = async ({
  userId,
  data,
}: {
  userId: string;
  data: Partial<ProfileSettingsData & { locale: Locale }>;
}): Promise<PublicUser> => {
  const response = await fetch(`${url}/${userId}`, {
    ...fetchInitWithCookies(),
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update profile");

  return response.json();
};

export const UsersApi = {
  getAll: getAllUsers,
  getOne: fetchUser,
  getOwn: fetchOwnProfile,
  updateOne: updateProfile,
};
