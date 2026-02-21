import { Board } from "@prisma/client";

import { BASE_API_URL, fetchInitWithCookies } from "@/shared/api";

import { BoardWithAccess } from "./types";

const url = BASE_API_URL() + "/boards";

const fetchBoards = async (
  cookieString?: string,
): Promise<BoardWithAccess[]> => {
  const response = await fetch(url, fetchInitWithCookies(cookieString));

  if (!response.ok) throw new Error("Failed to fetch boards");

  return response.json();
};

const updateBoard = async (
  board: Partial<Board> & Pick<Board, "id">,
) => {
  const response = await fetch(`${url}/${board.id}`, {
    ...fetchInitWithCookies(),
    method: "PATCH",
    body: JSON.stringify(board),
  });

  if (!response.ok) throw new Error("Failed to update board");

  return response.json();
};

const removeBoard = async (boardId: string) => {
  const response = await fetch(`${url}/${boardId}`, {
    ...fetchInitWithCookies(),
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete board");

  return response.json();
};

export const BoardsApi = {
  getAll: fetchBoards,
  updateOne: updateBoard,
  removeOne: removeBoard,
};
