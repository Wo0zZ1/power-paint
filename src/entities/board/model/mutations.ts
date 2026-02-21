import { useMutation, useQueryClient } from "@tanstack/react-query";

import { BoardsApi } from "./api";
import { BOARDS_QUERY_KEY } from "./queries";
import { BoardWithAccess } from "./types";

export const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BoardsApi.updateOne,

    onSuccess: (data) => {
      queryClient.setQueryData(
        [BOARDS_QUERY_KEY],
        (oldData: BoardWithAccess[]) => [
          data,
          ...oldData.filter((w) => w.board.id !== data.board.id),
        ],
      );
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

    onSuccess: (_, boardId) => {
      queryClient.setQueryData(
        [BOARDS_QUERY_KEY],
        (oldData: BoardWithAccess[]) =>
          oldData.filter((w) => w.board.id !== boardId),
      );
    },

    onError: (error, variables) => {
      console.error("Error deleting board:", error, variables);
    },
  });
};
