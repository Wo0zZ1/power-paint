import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WORKSPACES_QUERY_KEY } from "@/shared/constants";

import { WorkspacesApi } from "./api";
import type { WorkspaceWithAccess } from "./types";

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.createOne,

    onSuccess: (data) => {
      queryClient.setQueryData(
        [WORKSPACES_QUERY_KEY, "team", {}],
        (oldData: WorkspaceWithAccess[]) => [data, ...oldData],
      );
    },

    onError: (error, variables) => {
      console.error("Error creating workspace:", error, variables);
    },
  });
};

export const useUpdateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.updateOne,

    onSuccess: (data) => {
      queryClient.setQueryData(
        [WORKSPACES_QUERY_KEY, "team", {}],
        (oldData: WorkspaceWithAccess[]) => [
          data,
          ...oldData.filter((w) => w.workspace.id !== data.workspace.id),
        ],
      );
    },

    onError: (error, variables) => {
      console.error("Error updating workspace:", error, variables);
    },
  });
};

export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.removeOne,

    onSuccess: (_, workspaceId) => {
      queryClient.setQueryData(
        [WORKSPACES_QUERY_KEY, "team", {}],
        (oldData: WorkspaceWithAccess[]) =>
          oldData.filter((w) => w.workspace.id !== workspaceId),
      );
    },

    onError: (error, variables) => {
      console.error("Error deleting workspace:", error, variables);
    },
  });
};
