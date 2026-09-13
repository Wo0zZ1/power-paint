import type { Workspace } from "@prisma/client";
import { AccessLevel, MemberRole } from "@prisma/client";
import type { Session } from "next-auth";

import type { AccessRole } from "../constants";
import type { Board } from "../types";

import { prisma } from "./prisma";

export const getAccessToWorkspace = async (
  workspace: Workspace,
  user?: Session["user"],
): Promise<AccessRole> => {
  if (user && user.id === workspace.ownerId) return "OWNER";

  const workspaceMember = user
    ? await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: { workspaceId: workspace.id, userId: user.id },
        },
      })
    : null;

  if (workspaceMember) {
    switch (workspaceMember.role) {
      case MemberRole.admin:
        return "ADMIN";
      case MemberRole.editor:
        return "EDITOR";
      case MemberRole.viewer:
        return "VIEWER";
      default:
        return "NONE";
    }
  }

  switch (workspace.accessLevel) {
    case AccessLevel.public_edit:
      return "EDITOR";
    case AccessLevel.public_view:
      return "VIEWER";
    case AccessLevel.private:
    default:
      return "NONE";
  }
};

export const getAccessToBoard = async (
  board: Pick<Board, "id" | "workspaceId" | "ownerId" | "accessLevel">,
  user?: Session["user"],
): Promise<AccessRole> => {
  if (user && user.id === board.ownerId) return "OWNER";

  const workspace = await prisma.workspace.findUnique({
    where: { id: board.workspaceId },
  });
  if (!workspace) return "NONE";

  if (user && user.id === workspace.ownerId) return "OWNER";

  const boardMember = user
    ? await prisma.boardMember.findUnique({
        where: { boardId_userId: { boardId: board.id, userId: user.id } },
      })
    : null;

  const workspaceMember = user
    ? await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: { workspaceId: workspace.id, userId: user.id },
        },
      })
    : null;

  if (boardMember || workspaceMember) {
    if (
      boardMember?.role === MemberRole.admin ||
      workspaceMember?.role === MemberRole.admin
    ) {
      return "ADMIN";
    } else if (
      boardMember?.role === MemberRole.editor ||
      workspaceMember?.role === MemberRole.editor
    ) {
      return "EDITOR";
    } else if (
      boardMember?.role === MemberRole.viewer ||
      workspaceMember?.role === MemberRole.viewer
    ) {
      return "VIEWER";
    } else {
      return "NONE";
    }
  }

  if (
    board.accessLevel === AccessLevel.public_edit ||
    workspace.accessLevel === AccessLevel.public_edit
  ) {
    return "EDITOR";
  } else if (
    board.accessLevel === AccessLevel.public_view ||
    workspace.accessLevel === AccessLevel.public_view
  ) {
    return "VIEWER";
  } else {
    return "NONE";
  }
};
