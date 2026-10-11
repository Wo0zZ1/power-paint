import { useMutation, useQueryClient } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "@/shared/constants";

import { UsersApi } from "./api";

// PATCH отвечает публичным профилем без телефона и языка, поэтому свой профиль
// перезапрашивается, а не собирается из ответа.
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UsersApi.updateOne,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] }),

    onError: (error, variables) => {
      console.error("Error updating profile:", error, variables);
    },
  });
};
