import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WorkspacesApi } from "./api";
import { WORKSPACES_QUERY_KEY } from "./queries";
import { WorkspaceWithAccess } from "./types";

export const useUpdateWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.updateOne,

    onSuccess: (data) => {
      queryClient.setQueryData(
        [WORKSPACES_QUERY_KEY],
        (oldData: WorkspaceWithAccess[]) => [
          data,
          ...oldData.filter((w) => w.workspace.id !== data.workspace.id),
        ],
      );
    },

    onError: (error, variables) => {
      console.error("Error renaming workspace:", error, variables);
    },
  });
};

export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WorkspacesApi.removeOne,

    onSuccess: (_, workspaceId) => {
      queryClient.setQueryData(
        [WORKSPACES_QUERY_KEY],
        (oldData: WorkspaceWithAccess[]) =>
          oldData.filter((w) => w.workspace.id !== workspaceId),
      );
    },

    onError: (error, variables) => {
      console.error("Error deleting workspace:", error, variables);
    },
  });
};
