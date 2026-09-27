import { useQuery } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "@/shared/constants";
import type { PublicUser } from "@/shared/types";

import { UsersApi } from "./api";

interface UseGetUsersQueryProps {
  query?: string;
}

export const useGetUsersQuery = ({
  query = "",
}: UseGetUsersQueryProps = {}) => {
  return useQuery<PublicUser[]>({
    queryKey: [USERS_QUERY_KEY, query],
    queryFn: () => UsersApi.getAll({ query }),
    // Без строки users отвечает 400: список всех пользователей не отдаётся.
    enabled: query.length > 0,
    staleTime: 1000 * 60,
  });
};
