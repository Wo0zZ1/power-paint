import { useQuery } from "@tanstack/react-query";

import { BoardsApi } from "./api";

export const BOARDS_QUERY_KEY = "boards";

export const useGetBoardsQuery = () => {
  return useQuery({
    queryKey: [BOARDS_QUERY_KEY],
    queryFn: () => BoardsApi.getAll(),
  });
};
