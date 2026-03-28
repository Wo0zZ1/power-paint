import { useState } from "react";

import { useGetUsersQuery } from "@/entities/user";

interface useUsersSearchQueryProps {
  defaultSearch?: string;
}

export const useUsersSearchQuery = ({
  defaultSearch = "",
}: useUsersSearchQueryProps = {}) => {
  const [searchQuery, setSearchQuery] = useState<string>(defaultSearch);

  const { data: queryUsers } = useGetUsersQuery(searchQuery);

  return {
    searchQuery,
    setSearchQuery,
    queryUsers,
  };
};
