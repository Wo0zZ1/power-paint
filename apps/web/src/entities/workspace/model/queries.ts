import type { WorkspaceType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { WORKSPACES_QUERY_KEY } from "@/shared/constants";

import { WorkspacesApi } from "./api";

export const useGetWorkspacesQuery = ({
  userId,
  type,
}: {
  userId?: string;
  type?: WorkspaceType;
} = {}) => {
  const queryKey = type
    ? [WORKSPACES_QUERY_KEY, type, { userId }]
    : [WORKSPACES_QUERY_KEY, "all", { userId }];

  return useQuery({
    queryKey,
    queryFn: () => WorkspacesApi.getAll({ userId, type }),
  });
};
