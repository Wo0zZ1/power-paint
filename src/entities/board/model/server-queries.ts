import { queryOptions } from "@tanstack/react-query";

import { BOARDS_QUERY_KEY } from "@/shared/constants";

import { BoardsApi } from "./api";

export const getBoardsQueryOption = ({
  userId,
  workspaceId,
  cookieString,
}: {
  userId?: string;
  workspaceId?: string;
  cookieString: string;
}) => {
  return queryOptions({
    queryKey: [BOARDS_QUERY_KEY, `workspace-${workspaceId}`, { userId }],
    queryFn: () => BoardsApi.getAll({ userId, workspaceId, cookieString }),
  });
};
