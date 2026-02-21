import { queryOptions } from "@tanstack/react-query";

import { BoardsApi } from "./api";
import { BOARDS_QUERY_KEY } from "./queries";

export const getBoardsQueryOption = (cookieString: string) =>
  queryOptions({
    queryKey: [BOARDS_QUERY_KEY],
    queryFn: () => BoardsApi.getAll(cookieString),
  });
