import type { Workspace, WorkspaceType } from "@power-paint/db";

import { GET_BASE_API_URL, fetchInitWithCookies } from "@/shared/api";

import type { CreateWorkspaceData, UpdateWorkspaceData } from "./schemas";
import type { WorkspacesPage, WorkspaceWithAccess } from "./types";

export const url = GET_BASE_API_URL() + "/workspaces";

const fetchWorkspaces = async ({
  cookieString,
  type,
  userId,
  manageable,
  limit,
  cursor,
}: {
  cookieString?: string;
  type?: WorkspaceType;
  userId?: string;
  manageable?: boolean;
  limit?: number;
  cursor?: string;
}): Promise<WorkspacesPage> => {
  let reqUrl = url + "?";
  if (type) reqUrl += `type=${type}&`;
  if (userId) reqUrl += `userId=${userId}&`;
  if (manageable) reqUrl += "manageable=true&";
  if (limit) reqUrl += `limit=${limit}&`;
  if (cursor) reqUrl += `cursor=${cursor}&`;

  const response = await fetch(reqUrl, fetchInitWithCookies({ cookieString }));

  if (!response.ok) throw new Error("Failed to fetch workspaces");

  return response.json();
};

const fetchWorkspace = async ({
  workspaceId,
  cookieString,
}: {
  workspaceId: Workspace["id"];
  cookieString?: string;
}): Promise<WorkspaceWithAccess> => {
  const response = await fetch(
    `${url}/${workspaceId}`,
    fetchInitWithCookies({ cookieString }),
  );

  if (!response.ok) throw new Error("Failed to fetch workspace");

  return response.json();
};

export const fetchWorkspaceMeta = async ({
  workspaceId,
  forwardedFor,
}: {
  workspaceId: Workspace["id"];
  forwardedFor?: string | null;
}): Promise<Pick<Workspace, "name">> => {
  const response = await fetch(
    `${url}/${workspaceId}/meta`,
    fetchInitWithCookies({ forwardedFor }),
  );

  if (!response.ok) throw new Error("Failed to fetch workspace meta");

  return response.json();
};

const createWorkspace = async (
  workspace: CreateWorkspaceData,
): Promise<WorkspaceWithAccess> => {
  const response = await fetch(url, {
    ...fetchInitWithCookies(),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workspace),
  });

  if (!response.ok) throw new Error("Failed to create workspace");

  return response.json();
};

const updateWorkspace = async ({
  workspaceId,
  data,
}: {
  workspaceId: Workspace["id"];
  data: UpdateWorkspaceData;
}): Promise<WorkspaceWithAccess> => {
  const response = await fetch(`${url}/${workspaceId}`, {
    ...fetchInitWithCookies(),
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update workspace");

  return response.json();
};

const removeWorkspace = async (
  workspaceId: Workspace["id"],
): Promise<WorkspaceWithAccess> => {
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
