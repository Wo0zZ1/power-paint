import { WorkspaceType } from "@prisma/client";

import type { useGetWorkspacesQuery } from "./queries";

export const getPersonalWorkspace = (
  workspacesData: Awaited<ReturnType<typeof useGetWorkspacesQuery>>["data"],
) => {
  return workspacesData?.find(
    ({ workspace }) => workspace.type === WorkspaceType.personal,
  )?.workspace;
};
