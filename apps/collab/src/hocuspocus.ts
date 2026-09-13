import { Redis } from "@hocuspocus/extension-redis";
import { Server } from "@hocuspocus/server";

import { CONFIG } from "./config";
import { onAuthenticate } from "./extensions/auth";
import { postgresDatabase } from "./extensions/database";

const redisUrl = new URL(CONFIG.REDIS_URL);

// Redis-расширение синхронизирует изменения между экземплярами: соавторы одного
// холста могут попасть на разные экземпляры при переподключении или fail-over.
// Нагрузка при этом делится по документам, а не внутри документа.
export const hocuspocus = new Server(
  {
    name: "power-paint",

    extensions: [
      postgresDatabase,
      new Redis({
        host: redisUrl.hostname,
        port: Number(redisUrl.port || 6379),
      }),
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
