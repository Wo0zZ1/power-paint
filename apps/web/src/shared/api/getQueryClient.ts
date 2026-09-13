import { QueryClient } from "@tanstack/react-query";

import { queryClientOptions } from "../config";

let queryClient: QueryClient | null = null;

export function getQueryClient() {
  if (typeof window === "undefined") return new QueryClient(queryClientOptions);

  if (!queryClient) queryClient = new QueryClient(queryClientOptions);

  return queryClient;
}
