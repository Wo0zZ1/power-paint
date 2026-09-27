import { Redis } from "@hocuspocus/extension-redis";
import { Server } from "@hocuspocus/server";
import RedisClient from "ioredis";

import { CONFIG } from "./config";
import { onAuthenticate } from "./extensions/auth";
import { postgresDatabase } from "./extensions/database";

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
      new Redis({ createClient: () => new RedisClient(CONFIG.REDIS_URL) }),
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
