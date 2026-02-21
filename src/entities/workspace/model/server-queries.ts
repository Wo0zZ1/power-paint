import { queryOptions } from "@tanstack/react-query";

import { WorkspacesApi } from "./api";

export const getWorkspacesQueryOption = (cookieString: string) =>
  queryOptions({
    queryKey: ["workspaces"],
    queryFn: () => WorkspacesApi.getAll(cookieString),
  });
