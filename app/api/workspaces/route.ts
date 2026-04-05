import type { WorkspaceType } from "@prisma/client";
import { unauthorized } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createWorkspaceSchema,
  type WorkspaceWithAccess,
} from "@/entities/workspace";
import { auth } from "@/shared/auth";
import { AccessRole } from "@/shared/constants";
import { getAccessToWorkspace } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export const GET = async (
  request: NextRequest,
): Promise<NextResponse<WorkspaceWithAccess[]>> => {
  const searchParams = request.nextUrl.searchParams;

  const userId = searchParams.get("userId") || undefined;
  const type =
    (searchParams.get("type") as WorkspaceType | undefined) || undefined;

  const workspaces = await prisma.workspace.findMany({
    where: { ownerId: userId, type },
    include: {
      boards: {
        omit: {
          darkPreview: true,
          lightPreview: true,
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  created_at: true,
                },
              },
            },
          },
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              created_at: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const session = await auth();

  const workspacesWithAccess = await Promise.all(
    workspaces.map(async (workspace) => {
      const accessRole = await getAccessToWorkspace(workspace, session?.user);

      return { workspace, accessRole };
    }),
  );

  const filteredWorkspacesWithAccess = workspacesWithAccess.filter(
    (w) => AccessRole[w.accessRole] >= AccessRole.VIEWER,
  );

  return NextResponse.json(filteredWorkspacesWithAccess);
};

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<WorkspaceWithAccess>> => {
  const body = await request.json();

  const { name, accessLevel } = z.parse(createWorkspaceSchema, body);

  const session = await auth();

  if (!session) return unauthorized();

  const newWorkspace = await prisma.workspace.create({
    data: {
      name,
      accessLevel,
      ownerId: session.user.id,
    },
    include: {
      boards: {
        omit: {
          darkPreview: true,
          lightPreview: true,
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  created_at: true,
                },
              },
            },
          },
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              created_at: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({
    workspace: newWorkspace,
    accessRole: "OWNER",
  });
};
