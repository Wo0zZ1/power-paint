import "dotenv/config";

import { hocuspocus } from "./hocuspocus";
import {
  closePostgresStorage,
  ensurePostgresStorageIsReady,
} from "./extensions/database";
import { PORT } from "./config";

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) return;

  isShuttingDown = true;
  console.log(`[shutdown] signal: ${signal}`);

  try {
    await hocuspocus.destroy();
  } catch (destroyError) {
    console.error("[shutdown] failed to destroy hocuspocus", destroyError);
  }

  try {
    await closePostgresStorage();
  } catch (closeError) {
    console.error("[shutdown] failed to close postgres pool", closeError);
  }

  process.exit(0);
}

async function main() {
  await ensurePostgresStorageIsReady();
  await hocuspocus.listen(PORT);

  console.log(`[listen] port: ${PORT}`);
}

process.once("SIGINT", () => {
  shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  shutdown("SIGTERM");
});

void main().catch(async (error) => {
  console.error("[startup] failed to start server", error);

  try {
    await hocuspocus.destroy();
  } catch (destroyError) {
    console.error("[startup] failed to destroy hocuspocus", destroyError);
  }

  try {
    await closePostgresStorage();
  } catch (closeError) {
    console.error("[startup] failed to close postgres pool", closeError);
  }

  process.exit(1);
});
