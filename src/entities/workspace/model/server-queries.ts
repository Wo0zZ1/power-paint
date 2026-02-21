import { queryOptions } from "@tanstack/react-query";

import { WorkspacesApi } from "./api";
import { WORKSPACES_QUERY_KEY } from "./queries";

export const getWorkspacesQueryOption = (cookieString: string) =>
  queryOptions({
    queryKey: [WORKSPACES_QUERY_KEY],
    queryFn: () => WorkspacesApi.getAll(cookieString),
  });
