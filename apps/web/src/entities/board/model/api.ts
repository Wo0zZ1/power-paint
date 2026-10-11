import type { Board } from "@power-paint/db";

import { GET_BASE_API_URL, fetchInitWithCookies } from "@/shared/api";
import type { BoardWithAccess } from "@/shared/types";

import type { CreateBoardFormData, UpdateBoardData } from "./schemas";

const url = GET_BASE_API_URL() + "/boards";

const fetchBoards = async ({
  cookieString,
  userId,
  workspaceId,
  limit,
}: {
  cookieString?: string;
  userId?: string;
  workspaceId?: string;
  limit?: number;
} = {}): Promise<BoardWithAccess[]> => {
  let reqUrl = url + "?";

  if (userId) reqUrl += `userId=${userId}&`;
  if (workspaceId) reqUrl += `workspaceId=${workspaceId}&`;
  if (limit) reqUrl += `limit=${limit}&`;

  const response = await fetch(reqUrl, fetchInitWithCookies({ cookieString }));

  if (!response.ok) throw new Error("Failed to fetch boards");

  return response.json();
};

const fetchBoard = async ({
  cookieString,
  forwardedFor,
  boardId,
}: {
  cookieString?: string;
  forwardedFor?: string | null;
  boardId: string;
}): Promise<BoardWithAccess> => {
  const reqUrl = `${url}/${boardId}?`;

  const response = await fetch(
    reqUrl,
    fetchInitWithCookies({ cookieString, forwardedFor }),
  );

  if (!response.ok) throw new Error("Failed to fetch boards");

  return response.json();
};

export const fetchBoardMeta = async ({
  boardId,
  forwardedFor,
}: {
  boardId: Board["id"];
  forwardedFor?: string | null;
}): Promise<Pick<Board, "name">> => {
  const response = await fetch(
    `${url}/${boardId}/meta`,
    fetchInitWithCookies({ forwardedFor }),
  );

  if (!response.ok) throw new Error("Failed to fetch board meta");

  return response.json();
};

const createBoard = async (
  board: CreateBoardFormData,
): Promise<BoardWithAccess> => {
  const response = await fetch(url, {
    ...fetchInitWithCookies(),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(board),
  });

  if (!response.ok) throw new Error("Failed to create board");

  return response.json();
};

const updateBoard = async ({
  boardId,
  data,
}: {
  boardId: Board["id"];
  data: UpdateBoardData;
}): Promise<BoardWithAccess> => {
  const response = await fetch(`${url}/${boardId}`, {
    ...fetchInitWithCookies(),
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update board");

  return response.json();
};

const removeBoard = async (boardId: string): Promise<BoardWithAccess> => {
  const response = await fetch(`${url}/${boardId}`, {
    ...fetchInitWithCookies(),
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete board");

  return response.json();
};

export const BoardsApi = {
  getAll: fetchBoards,
  getOne: fetchBoard,
  createOne: createBoard,
  updateOne: updateBoard,
  removeOne: removeBoard,
};
