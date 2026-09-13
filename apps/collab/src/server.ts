import { CONFIG } from "./config";
import { closePostgresStorage } from "./extensions/database";
import { hocuspocus } from "./hocuspocus";
import {
  startInvalidationListener,
  stopInvalidationListener,
} from "./invalidation";

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.log(`[shutdown] signal: ${signal}`);

  await Promise.allSettled([
    hocuspocus.destroy(),
    stopInvalidationListener(),
    closePostgresStorage(),
  ]);

  process.exit(0);
}

async function main() {
  await startInvalidationListener();
  await hocuspocus.listen(CONFIG.PORT);

  console.log(`[listen] port: ${CONFIG.PORT}`);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

void main().catch(async (error) => {
  console.error("[startup] failed to start server", error);

  await Promise.allSettled([
    hocuspocus.destroy(),
    stopInvalidationListener(),
    closePostgresStorage(),
  ]);

  process.exit(1);
});
