export const ROUTES = {
  ROOT: "/",
  SETTINGS: "/settings", // TODO Remove this route
  PROFILE: (uuid?: string) => `/profile/${uuid}` as const,
  BOARD: (boardId: string) => `/board/${boardId}` as const,
  DASHBOARD: {
    ROOT: "/dashboard",
    WORKSPACES: `/dashboard/workspaces`,
    WORKSPACE: (workspaceId: string) =>
      `/dashboard/workspace/${workspaceId}` as const,
    BOARDS: (workspaceId: string) =>
      `/dashboard/workspaces/${workspaceId}/boards` as const,
    BOARD: (workspaceId: string, boardId: string) =>
      `/dashboard/workspaces/${workspaceId}/boards/${boardId}` as const,
  },
  LOGIN: "/login",
  SINGUP: "/signup",
  NOT_FOUND: "/404",
} as const;
