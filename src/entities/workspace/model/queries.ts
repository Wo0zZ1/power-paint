import { useQuery } from "@tanstack/react-query";
import { WorkspaceType } from "@prisma/client";

import { WorkspacesApi } from "./api";

export const WORKSPACES_QUERY_KEY = "workspaces";

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
