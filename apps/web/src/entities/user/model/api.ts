import { GET_BASE_API_URL, fetchInitWithCookies } from "@/shared/api";
import type { PublicUser } from "@/shared/types";

const url = GET_BASE_API_URL() + "/users";

const getAllUsers = async ({
  query,
}: { query?: string } = {}): Promise<PublicUser[]> => {
  const params = new URLSearchParams();
  if (query) params.set("query", query);

  const response = await fetch(
    `${url}?${params.toString()}`,
    fetchInitWithCookies(),
  );

  if (!response.ok) throw new Error("Failed to fetch users");

  return response.json();
};

export const UsersApi = {
  getAll: getAllUsers,
};
