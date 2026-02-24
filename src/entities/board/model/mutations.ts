import { useMutation, useQueryClient } from "@tanstack/react-query";

import { BOARDS_QUERY_KEY, WORKSPACES_QUERY_KEY } from "@/shared/constants";

import { BoardsApi } from "./api";
import type { BoardWithAccess } from "./types";

export const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BoardsApi.createOne,

    onSuccess: (data) => {
      queryClient.setQueryData(
        [BOARDS_QUERY_KEY, `workspace-${data.board.workspaceId}`, {}],
        (oldData: BoardWithAccess[]) => [data, ...oldData],
      );

      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEY, data.board.workspaceId],
      });
    },

    onError: (error, variables) => {
      console.error("Error creating board:", error, variables);
    },
  });
};

export const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BoardsApi.updateOne,

    onSuccess: (data) => {
      queryClient.setQueryData(
        [BOARDS_QUERY_KEY, `workspace-${data.board.workspaceId}`, {}],
        (oldData: BoardWithAccess[]) => [
          data,
          ...oldData.filter((w) => w.board.id !== data.board.id),
        ],
      );

      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEY, data.board.workspaceId],
      });
    },

    onError: (error, variables) => {
      console.error("Error updating board:", error, variables);
    },
  });
};

export const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BoardsApi.removeOne,

    onSuccess: (data) => {
      queryClient.setQueryData(
        [BOARDS_QUERY_KEY, `workspace-${data.board.workspaceId}`, {}],
        (oldData: BoardWithAccess[]) =>
          oldData.filter((w) => w.board.id !== data.board.id),
      );

      queryClient.invalidateQueries({
        queryKey: [WORKSPACES_QUERY_KEY, data.board.workspaceId],
      });
    },

    onError: (error, variables) => {
      console.error("Error deleting board:", error, variables);
    },
  });
};
