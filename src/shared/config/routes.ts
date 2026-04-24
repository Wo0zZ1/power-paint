export const ROUTES = {
  ROOT: "/",
  PROFILE: (uuid?: string) => `/profiles/${uuid}` as const,
  BOARD: (boardId: string) => `/boards/${boardId}` as const,
  DASHBOARD: {
    ROOT: "/dashboard",
    WORKSPACES: `/dashboard/workspaces`,
    WORKSPACE: (workspaceId: string) =>
      `/dashboard/workspaces/${workspaceId}` as const,
    BOARDS: (workspaceId: string) =>
      `/dashboard/workspaces/${workspaceId}/boards` as const,
  },
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
  NOT_FOUND: "/404",
} as const;
