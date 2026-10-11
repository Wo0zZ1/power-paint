import { queryOptions } from "@tanstack/react-query";

import { BOARDS_QUERY_KEY } from "@/shared/constants";

import { BoardsApi } from "./api";

export const getBoardsQueryOption = ({
  userId,
  workspaceId,
  limit,
  cookieString,
}: {
  userId?: string;
  workspaceId?: string;
  limit?: number;
  cookieString: string;
}) => {
  return queryOptions({
    queryKey: [BOARDS_QUERY_KEY, `workspace-${workspaceId}`, { userId, limit }],
    queryFn: () =>
      BoardsApi.getAll({ userId, workspaceId, limit, cookieString }),
  });
};

export const getBoardQueryOption = ({
  boardId,
  cookieString,
  forwardedFor,
}: {
  boardId: string;
  cookieString: string;
  forwardedFor: string | null;
}) => {
  return queryOptions({
    queryKey: [BOARDS_QUERY_KEY, `board-${boardId}`],
    queryFn: () => BoardsApi.getOne({ boardId, cookieString, forwardedFor }),
  });
};
