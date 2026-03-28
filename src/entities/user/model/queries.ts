import { useQuery } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "@/shared/constants";
import type { PublicUser } from "@/shared/types";

import { UsersApi } from "./api";

export const useGetUsersQuery = (search?: string) => {
  return useQuery<PublicUser[]>({
    queryKey: [USERS_QUERY_KEY, search ?? ""],
    queryFn: () => UsersApi.getAll({ q: search }),
    staleTime: 1000 * 60,
  });
};
