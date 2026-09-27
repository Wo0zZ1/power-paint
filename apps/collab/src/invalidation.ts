import {
  boardAccessChangedSchema,
  boardDeletedSchema,
  EVENT_STREAMS,
} from "@power-paint/contracts";
import { consumeGroup, readBroadcast } from "@power-paint/events";

import { CONFIG } from "./config";
import { deleteDocument } from "./extensions/database";
import { hocuspocus } from "./hocuspocus";

// Разрыв соединений - единственный честный способ применить новые права:
// подключённый клиент уже прошёл проверку, и другого момента спросить заново нет.
const closeDocument = (boardId: string, reason: string) => {
  const document = hocuspocus.hocuspocus.documents.get(boardId);

  if (!document) return;

  console.log(`[invalidate] ${reason}: ${boardId}`);

  document.connections.forEach(({ connection }) => connection.close());
};

// DELETE идёт под мьютексом сохранения: сохранение, начатое до события,
// успеет закончиться и не перезапишет удаление.
const deleteBoard = async (boardId: string) => {
  const document = hocuspocus.hocuspocus.documents.get(boardId);

  closeDocument(boardId, "board deleted");

  if (document)
    await document.saveMutex.runExclusive(() => deleteDocument(boardId));
  else await deleteDocument(boardId);
};

const CONSUMER_GROUP = "collab";

let readers: ReturnType<typeof readBroadcast>[] = [];

// Соединения с документом у каждого экземпляра collab свои, поэтому событие
// нужно всем экземплярам, а не одному из группы. Но экземпляр, запущенный после
// события, его не увидит, и если в тот момент не работал ни один, состояние
// холста осталось бы навсегда - удаление дублируется через группу, которая
// помнит позицию в потоке.
export const startInvalidationListener = () => {
  readers = [
    consumeGroup({
      redisUrl: CONFIG.REDIS_URL,
      stream: EVENT_STREAMS.BOARD_DELETED,
      group: CONSUMER_GROUP,
      schema: boardDeletedSchema,
      handler: ({ boardId }) => deleteDocument(boardId),
    }),
    readBroadcast({
      redisUrl: CONFIG.REDIS_URL,
      stream: EVENT_STREAMS.BOARD_DELETED,
      schema: boardDeletedSchema,
      handler: ({ boardId }) => deleteBoard(boardId),
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
