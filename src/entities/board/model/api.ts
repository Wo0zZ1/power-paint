import type { Board } from "@prisma/client";

import { GET_BASE_API_URL, fetchInitWithCookies } from "@/shared/api";
import type { BoardWithAccess } from "@/shared/types";

import type { CreateBoardFormData, UpdateBoardData } from "./schemas";

const url = GET_BASE_API_URL() + "/boards";

const fetchBoards = async ({
  cookieString,
  userId,
  workspaceId,
}: {
  cookieString?: string;
  userId?: string;
  workspaceId?: string;
} = {}): Promise<BoardWithAccess[]> => {
  let reqUrl = url + "?";

  if (userId) reqUrl += `userId=${userId}&`;
  if (workspaceId) reqUrl += `workspaceId=${workspaceId}&`;

  const response = await fetch(reqUrl, fetchInitWithCookies(cookieString));

  if (!response.ok) throw new Error("Failed to fetch boards");

  return response.json();
};

const fetchBoard = async ({
  cookieString,
  boardId,
}: {
  cookieString?: string;
  boardId: string;
}): Promise<BoardWithAccess> => {
  const reqUrl = `${url}/${boardId}?`;

  const response = await fetch(reqUrl, fetchInitWithCookies(cookieString));

  if (!response.ok) throw new Error("Failed to fetch boards");

  return response.json();
};

const createBoard = async (
  board: CreateBoardFormData,
): Promise<BoardWithAccess> => {
  const response = await fetch(url, {
    ...fetchInitWithCookies(),
    method: "POST",
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
