import {
  boardAccessChangedSchema,
  boardDeletedSchema,
  EVENT_STREAMS,
} from "@power-paint/contracts";
import { readBroadcast } from "@power-paint/events";

import { CONFIG } from "./config";
import { hocuspocus } from "./hocuspocus";

// Разрыв соединений - единственный честный способ применить новые права:
// подключённый клиент уже прошёл проверку, и другого момента спросить заново нет.
const closeDocument = (boardId: string, reason: string) => {
  const document = hocuspocus.hocuspocus.documents.get(boardId);

  if (!document) return;

  console.log(`[invalidate] ${reason}: ${boardId}`);

  document.connections.forEach(({ connection }) => connection.close());
};

let readers: ReturnType<typeof readBroadcast>[] = [];

// Соединения с документом у каждого экземпляра collab свои, поэтому событие
// нужно всем экземплярам, а не одному из группы.
export const startInvalidationListener = () => {
  readers = [
    readBroadcast({
      redisUrl: CONFIG.REDIS_URL,
      stream: EVENT_STREAMS.BOARD_DELETED,
      schema: boardDeletedSchema,
      handler: ({ boardId }) => closeDocument(boardId, "board deleted"),
    }),
    readBroadcast({
      redisUrl: CONFIG.REDIS_URL,
      stream: EVENT_STREAMS.BOARD_ACCESS_CHANGED,
      schema: boardAccessChangedSchema,
      handler: ({ boardId }) => closeDocument(boardId, "access changed"),
    }),
  ];
};

export const stopInvalidationListener = () =>
  Promise.all(readers.map((reader) => reader.close()));
