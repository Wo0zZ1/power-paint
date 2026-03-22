"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";
import { useState } from "react";

import { queryClientOptions } from "@/shared/config";

interface QueryProviderProps {
  isDevtoolsEnabled?: boolean;
}

export function QueryProvider({
  isDevtoolsEnabled = true,
  children,
}: PropsWithChildren<QueryProviderProps>) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {isDevtoolsEnabled && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
