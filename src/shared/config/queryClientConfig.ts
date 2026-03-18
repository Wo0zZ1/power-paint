import type { QueryClientConfig } from "@tanstack/react-query";

// TODO: Configure query client  options
export const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
} satisfies QueryClientConfig;
