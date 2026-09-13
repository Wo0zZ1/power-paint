import type { WorkspaceType } from "@prisma/client";
import { queryOptions } from "@tanstack/react-query";

import { WORKSPACES_QUERY_KEY } from "@/shared/constants";

import { WorkspacesApi } from "./api";

export const getWorkspacesQueryOption = ({
  userId,
  type,
  cookieString,
}: {
  userId?: string;
  type?: WorkspaceType;
  cookieString: string;
}) => {
  const queryKey = type
    ? [WORKSPACES_QUERY_KEY, type, { userId }]
    : [WORKSPACES_QUERY_KEY, "all", { userId }];

  return queryOptions({
    queryKey,
    queryFn: () => WorkspacesApi.getAll({ userId, type, cookieString }),
  });
};

export const getWorkspaceQueryOption = ({
  workspaceId,
  cookieString,
}: {
  workspaceId: string;
  cookieString: string;
}) => {
  return queryOptions({
    queryKey: [WORKSPACES_QUERY_KEY, workspaceId],
    queryFn: () => WorkspacesApi.getOne({ workspaceId, cookieString }),
  });
};
