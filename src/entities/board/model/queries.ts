import { useQuery } from "@tanstack/react-query";

import { BoardsApi } from "./api";

export const BOARDS_QUERY_KEY = "boards";

export const useGetBoardsQuery = ({
  userId,
  workspaceId,
}: {
  userId?: string;
  workspaceId?: string;
}) => {
  return useQuery({
    queryKey: [BOARDS_QUERY_KEY, `workspace-${workspaceId}`, { userId }],
    queryFn: () => BoardsApi.getAll({ userId, workspaceId }),
  });
};
