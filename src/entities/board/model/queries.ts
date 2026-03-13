import { useQuery } from "@tanstack/react-query";

import { BOARDS_QUERY_KEY } from "@/shared/constants";

import { BoardsApi } from "./api";

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

export const useGetBoardQuery = ({ boardId }: { boardId: string }) => {
  return useQuery({
    queryKey: [BOARDS_QUERY_KEY, `board-${boardId}`],
    queryFn: () => BoardsApi.getOne({ boardId }),
  });
};
