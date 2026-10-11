import { Redis } from "@hocuspocus/extension-redis";
import { Server } from "@hocuspocus/server";
import RedisClient from "ioredis";

import { CONFIG } from "./config";
import { onAuthenticate } from "./extensions/auth";
import { postgresDatabase } from "./extensions/database";

// Без обработчика ioredis печатает стек на каждую попытку переподключения, и
// перезапуск Redis заваливает лог. Достаточно строки о потере связи.
const createRedisClient = () => {
  const client = new RedisClient(CONFIG.REDIS_URL);
  let isFailing = false;

  client.on("error", (error: Error) => {
    if (!isFailing) console.error(`Redis sync: ${error.message}`);
    isFailing = true;
  });
  client.on("ready", () => {
    isFailing = false;
  });

  return client;
};

// Redis-расширение синхронизирует изменения между экземплярами: соавторы одного
// холста могут попасть на разные экземпляры при переподключении или fail-over.
// Нагрузка при этом делится по документам, а не внутри документа.
export const hocuspocus = new Server(
  {
    name: "power-paint",

    extensions: [
      postgresDatabase,
      // Клиент строится из полного адреса: из хоста и порта пропали бы пароль
      // и номер базы, и синхронизация молча не работала бы там, где они есть.
      new Redis({ createClient: createRedisClient }),
    ],

    onAuthenticate,

    debounce: 1000,

    async onConnect({ documentName }) {
      console.log(`[connect]\troom: ${documentName}`);
    },

    async onDisconnect({ documentName }) {
      console.log(`[disconnect]\troom: ${documentName}`);
    },
  },
  { allowSynchronousEvents: false },
);
