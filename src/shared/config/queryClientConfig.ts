import type { QueryClientConfig } from "@tanstack/react-query";

// TODO: Configure query client  options
export const queryClientOptions = {
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,
      staleTime: 60 * 1000,
      placeholderData: (prevData: unknown) => prevData,
    },
  },
} satisfies QueryClientConfig;
