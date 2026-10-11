import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WORKSPACES_QUERY_KEY } from "@/shared/constants/queryKeys";

import { WorkspacesApi } from "./api";

// Списки областей разбиты на страницы и лимиты, и точечно поправить каждую
// закэшированную страницу сложнее, чем перезапросить их.
export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.createOne,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [WORKSPACES_QUERY_KEY] }),

    onError: (error, variables) => {
      console.error("Error creating workspace:", error, variables);
    },
  });
};

export const useUpdateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.updateOne,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [WORKSPACES_QUERY_KEY] }),

    onError: (error, variables) => {
      console.error("Error updating workspace:", error, variables);
    },
  });
};

export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.removeOne,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [WORKSPACES_QUERY_KEY] }),

    onError: (error, variables) => {
      console.error("Error deleting workspace:", error, variables);
    },
  });
};
