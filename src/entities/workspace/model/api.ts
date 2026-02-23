import { Workspace, WorkspaceType } from "@prisma/client";

import { GET_BASE_API_URL, fetchInitWithCookies } from "@/shared/api";

import { CreateWorkspaceData } from "@/features/create-workspace";

import { WorkspaceWithAccess } from "./types";

export const url = GET_BASE_API_URL() + "/workspaces";

const fetchWorkspaces = async ({
  cookieString,
  type,
  userId,
}: {
  cookieString?: string;
  type?: WorkspaceType;
  userId?: string;
}): Promise<WorkspaceWithAccess[]> => {
  let reqUrl = url + "?";
  if (type) reqUrl += `type=${type}&`;
  if (userId) reqUrl += `userId=${userId}&`;

  const response = await fetch(reqUrl, fetchInitWithCookies(cookieString));

  if (!response.ok) throw new Error("Failed to fetch workspaces");

  return response.json();
};

const fetchWorkspace = async ({
  workspaceId,
  cookieString,
}: {
  workspaceId: string;
  cookieString?: string;
}): Promise<WorkspaceWithAccess> => {
  const response = await fetch(
    `${url}/${workspaceId}`,
    fetchInitWithCookies(cookieString),
  );

  if (!response.ok) throw new Error("Failed to fetch workspace");

  return response.json();
};

const createWorkspace = async (workspace: CreateWorkspaceData) => {
  const response = await fetch(url, {
    ...fetchInitWithCookies(),
    method: "POST",
    body: JSON.stringify(workspace),
  });

  if (!response.ok) throw new Error("Failed to create workspace");

  return response.json();
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

  return response.json();
};

const removeWorkspace = async (workspaceId: string) => {
  const response = await fetch(`${url}/${workspaceId}`, {
    ...fetchInitWithCookies(),
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete workspace");

  return response.json();
};

export const WorkspacesApi = {
  getAll: fetchWorkspaces,
  getOne: fetchWorkspace,
  createOne: createWorkspace,
  updateOne: updateWorkspace,
  removeOne: removeWorkspace,
};
