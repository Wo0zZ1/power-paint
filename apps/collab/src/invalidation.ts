import {
  boardAccessChangedSchema,
  boardDeletedSchema,
  EVENT_CHANNELS,
} from "@power-paint/contracts";
import { createSubscriber } from "@power-paint/events";

import { CONFIG } from "./config";
import { hocuspocus } from "./hocuspocus";

const subscriber = createSubscriber(CONFIG.REDIS_URL);

// Разрыв соединений - единственный честный способ применить новые права:
// подключённый клиент уже прошёл проверку, и другого момента спросить заново нет.
const closeDocument = (boardId: string, reason: string) => {
  const document = hocuspocus.hocuspocus.documents.get(boardId);

  if (!document) return;

  console.log(`[invalidate] ${reason}: ${boardId}`);

  document.connections.forEach(({ connection }) => connection.close());
};

export const startInvalidationListener = async () => {
  await subscriber.connect();

  await subscriber.subscribe(
    EVENT_CHANNELS.BOARD_DELETED,
    boardDeletedSchema,
    ({ boardId }) => closeDocument(boardId, "board deleted"),
  );

  await subscriber.subscribe(
    EVENT_CHANNELS.BOARD_ACCESS_CHANGED,
    boardAccessChangedSchema,
    ({ boardId }) => closeDocument(boardId, "access changed"),
  );
};

export const stopInvalidationListener = () => subscriber.close();
