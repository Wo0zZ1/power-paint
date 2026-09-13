"use client";

import { useState } from "react";

import { useDebounce } from "@/shared/lib/hooks";

import { useGetUsersQuery } from "./queries";

interface useUsersSearchQueryProps {
  defaultQuery?: string;
  debounce?: number;
}

export const useUsersSearchQuery = ({
  defaultQuery = "",
  debounce = 0,
}: useUsersSearchQueryProps = {}) => {
  const [query, setQuery] = useState<string>(defaultQuery);

  const debouncedQuery = useDebounce(query, debounce);

  const { data, isFetching } = useGetUsersQuery({
    query: debouncedQuery,
  });

  return {
    queryUsers: data,
    usersQuery: query,
    setUsersQuery: setQuery,
    isUsersFetching: isFetching,
  };
};
