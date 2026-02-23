import { queryOptions } from "@tanstack/react-query";
import { WorkspaceType } from "@prisma/client";

import { WorkspacesApi } from "./api";
import { WORKSPACES_QUERY_KEY } from "./queries";

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
