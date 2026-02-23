export type { WorkspaceWithAccess, WorkspaceWithBoards } from "./model/types";

export { WorkspaceCard } from "./ui/WorkspaceCard";

export { WORKSPACES_QUERY_KEY, useGetWorkspacesQuery } from "./model/queries";

export {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from "./model/mutations";

export { getPersonalWorkspace } from "./model/utils";
