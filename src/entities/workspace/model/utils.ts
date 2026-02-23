import { WorkspaceType } from "@prisma/client/client";
import { useGetWorkspacesQuery } from "./queries";

export const getPersonalWorkspace = (
  workspacesData: Awaited<ReturnType<typeof useGetWorkspacesQuery>>["data"],
) => {
  return workspacesData?.find(
    ({ workspace }) => workspace.type === WorkspaceType.personal,
  )?.workspace;
};
