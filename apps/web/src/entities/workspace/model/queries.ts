import { MAX_WORKSPACES_PAGE_SIZE } from "@power-paint/contracts";
import type { WorkspaceType } from "@power-paint/db";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { WORKSPACES_QUERY_KEY } from "@/shared/constants";

import { WorkspacesApi } from "./api";

export const useGetWorkspacesQuery = ({
  type,
  limit,
  manageable,
}: {
  type?: WorkspaceType;
  limit?: number;
  manageable?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [WORKSPACES_QUERY_KEY, "list", { type, limit, manageable }],
    queryFn: () => WorkspacesApi.getAll({ type, limit, manageable }),
  });
};

// Для выбора области при создании доски. Областей, где пользователь
// администратор, на практике единицы, поэтому хватает одной страницы.
export const useGetManageableWorkspacesQuery = () =>
  useGetWorkspacesQuery({ manageable: true, limit: MAX_WORKSPACES_PAGE_SIZE });

export const useGetWorkspacesInfiniteQuery = ({
  type,
}: {
  type?: WorkspaceType;
} = {}) => {
  return useInfiniteQuery({
    queryKey: [WORKSPACES_QUERY_KEY, "infinite", { type }],
    queryFn: ({ pageParam }) =>
      WorkspacesApi.getAll({ type, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
