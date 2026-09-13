import type { Context, onAuthenticatePayload } from "@hocuspocus/server";
import type { AccessRole } from "@power-paint/contracts";

import { CONFIG } from "../config";

declare module "@hocuspocus/server" {
  export interface Context {
    accessRole: AccessRole;
    userId?: string;
  }
}

const throwUnauthorized = (): never => {
  throw new Error("Unauthorized");
};

// Права спрашиваем у boards, а не разбираем токен сами. Инвариант доступа
// (наследование от рабочей области) живёт в одном месте, и realtime-сервис
// не обязан его повторять.
const fetchAccessRole = async (
  boardId: string,
  userId?: string,
): Promise<AccessRole> => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const url = `${CONFIG.BOARDS_SERVICE_URL}/internal/boards/${boardId}/access${query}`;

  const response = await fetch(url).catch(() => null);

  if (!response?.ok) return "NONE";

  const { accessRole } = (await response.json()) as { accessRole: AccessRole };

  return accessRole;
};

export async function onAuthenticate({
  documentName,
  requestHeaders,
  connectionConfig,
}: onAuthenticatePayload): Promise<Context> {
  // Личность ставит шлюз после интроспекции, сюда она приходит уже проверенной.
  const header = requestHeaders["x-user-id"];
  const userId = Array.isArray(header) ? header[0] : header;

  const accessRole = await fetchAccessRole(documentName, userId);

  if (accessRole === "NONE") throwUnauthorized();

  if (accessRole === "VIEWER") connectionConfig.readOnly = true;

  return { accessRole, userId };
}
