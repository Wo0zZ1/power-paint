export const ROUTES = {
  ROOT: "/",
  SETTINGS: "/settings", // TODO Remove this route
  PROFILE: (uuid?: string) => `/profile/${uuid}` as const,
  BOARD: (boardId: string) => `/board/${boardId}` as const,
  DASHBOARD: {
    ROOT: "/dashboard",
    BOARDS: `/dashboard/boards`,
    WORKSPACES: (workspaceId?: string) =>
      `/dashboard/workspaces/${workspaceId}` as const,
  },
  LOGIN: "/login",
  SINGUP: "/signup",
  NOT_FOUND: "/404",
} as const;
