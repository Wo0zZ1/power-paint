import { queryOptions } from "@tanstack/react-query";

import { USERS_QUERY_KEY } from "@/shared/constants";

import { UsersApi } from "./api";

export const getUserQueryOption = ({
  userId,
  cookieString,
}: {
  userId: string;
  cookieString: string;
}) =>
  queryOptions({
    queryKey: [USERS_QUERY_KEY, "one", userId],
    queryFn: () => UsersApi.getOne({ userId, cookieString }),
  });

export const getOwnProfileQueryOption = ({
  cookieString,
}: {
  cookieString: string;
}) =>
  queryOptions({
    queryKey: [USERS_QUERY_KEY, "me"],
    queryFn: () => UsersApi.getOwn({ cookieString }),
  });
