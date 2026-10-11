import { MAX_WORKSPACES_PAGE_SIZE } from "@power-paint/contracts";
import type { WorkspaceType } from "@power-paint/db";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { WORKSPACES_QUERY_KEY } from "@/shared/constants";

import { WorkspacesApi } from "./api";

export const getWorkspacesQueryOption = ({
  type,
  limit,
  manageable,
  cookieString,
}: {
  type?: WorkspaceType;
  limit?: number;
  manageable?: boolean;
  cookieString: string;
}) => {
  return queryOptions({
    queryKey: [WORKSPACES_QUERY_KEY, "list", { type, limit, manageable }],
    queryFn: () =>
      WorkspacesApi.getAll({ type, limit, manageable, cookieString }),
  });
};

export const getManageableWorkspacesQueryOption = ({
  cookieString,
}: {
  cookieString: string;
}) =>
  getWorkspacesQueryOption({
    manageable: true,
    limit: MAX_WORKSPACES_PAGE_SIZE,
    cookieString,
  });

export const getWorkspacesInfiniteQueryOption = ({
  type,
  cookieString,
}: {
  type?: WorkspaceType;
  cookieString: string;
}) => {
  return infiniteQueryOptions({
    queryKey: [WORKSPACES_QUERY_KEY, "infinite", { type }],
    queryFn: ({ pageParam }) =>
      WorkspacesApi.getAll({ type, cursor: pageParam, cookieString }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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
