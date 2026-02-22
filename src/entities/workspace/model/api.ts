import { Workspace } from "@prisma/client";

import { BASE_API_URL, fetchInitWithCookies } from "@/shared/api";

import { WorkspaceWithAccess } from "./types";
import { CreateWorkspaceData } from "@/features/create-workspace";

const url = BASE_API_URL() + "/workspaces";

const fetchWorkspaces = async (
  cookieString?: string,
): Promise<WorkspaceWithAccess[]> => {
  const response = await fetch(url, fetchInitWithCookies(cookieString));

  if (!response.ok) throw new Error("Failed to fetch workspaces");

  return response.json() as unknown as WorkspaceWithAccess[];
};

const createWorkspace = async (workspace: CreateWorkspaceData) => {
  const response = await fetch(url, {
    ...fetchInitWithCookies(),
    method: "POST",
    body: JSON.stringify(workspace),
  });

  if (!response.ok) throw new Error("Failed to create workspace");

  return response.json() as unknown as WorkspaceWithAccess;
};

const updateWorkspace = async (
  workspace: Partial<Workspace> & Pick<Workspace, "id">,
) => {
  const response = await fetch(`${url}/${workspace.id}`, {
    ...fetchInitWithCookies(),
    method: "PATCH",
    body: JSON.stringify(workspace),
  });

  if (!response.ok) throw new Error("Failed to update workspace");

  return response.json() as unknown as WorkspaceWithAccess;
};

const removeWorkspace = async (workspaceId: string) => {
  const response = await fetch(`${url}/${workspaceId}`, {
    ...fetchInitWithCookies(),
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete workspace");

  return response.json() as unknown as WorkspaceWithAccess;
};

export const WorkspacesApi = {
  getAll: fetchWorkspaces,
  createOne: createWorkspace,
  updateOne: updateWorkspace,
  removeOne: removeWorkspace,
};
