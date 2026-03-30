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
    queryFn: () => UsersApi.getAll({ q: query }),
    staleTime: 1000 * 60,
  });
};
