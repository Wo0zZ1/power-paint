import { Server } from "@hocuspocus/server";
import { onAuthenticate } from "./extensions/auth";
import { postgresDatabase } from "./extensions/database";

export const hocuspocus = new Server(
  {
    name: "power-paint",

    extensions: [postgresDatabase],

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
