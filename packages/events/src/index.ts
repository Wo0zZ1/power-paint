import { randomUUID } from "node:crypto";
import { hostname } from "node:os";

import Redis from "ioredis";
import type { ZodType } from "zod";

// Поток хранит последние события, а не всю историю: потребитель, пролежавший
// дольше, чем нужно для STREAM_MAX_LENGTH событий, пропустит самые старые.
const STREAM_MAX_LENGTH = 10_000;
const READ_BATCH_SIZE = 100;
const READ_BLOCK_MS = 1_000;
const DEFAULT_RETRY_AFTER_MS = 30_000;
const LOOP_ERROR_DELAY_MS = 1_000;

// Логируем смену состояния, а не каждую неудачную попытку: иначе недоступный
// Redis забивает вывод десятками строк в секунду.
const logOnce = (label: string) => {
  let lastMessage = "";

  return (message: string) => {
    if (message === lastMessage) return;

    lastMessage = message;
    console.error(`${label}: ${message}`);
  };
};

// maxRetriesPerRequest: null - команда ждёт восстановления связи, а не падает
// после N попыток: отданное в publish событие уйдёт, как только Redis оживёт,
// а цикл чтения продолжит с того же места.
const connect = (redisUrl: string, label: string) => {
  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy: (attempt: number) => Math.min(attempt * 500, 10_000),
  });
  const log = logOnce(label);

  redis.on("error", (error) => log(error.message));

  return { redis, log };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type StreamEntry = [id: string, fields: string[]];

const parsePayload = (fields: string[]): unknown => {
  try {
    return JSON.parse(fields[fields.indexOf("payload") + 1]);
  } catch {
    return undefined;
  }
};

export const createPublisher = (redisUrl: string) => {
  const { redis, log } = connect(redisUrl, "Event publisher");

  return {
    // Событие шлётся после коммита в БД, и откатить сделанное из-за Redis уже
    // нельзя. Поэтому publish не ждёт ответа: команда стоит в очереди клиента,
    // пока Redis её не примет, а окончательная неудача только логируется.
    publish: <T>(stream: string, payload: T) => {
      redis
        .xadd(
          stream,
          "MAXLEN",
          "~",
          STREAM_MAX_LENGTH,
          "*",
          "payload",
          JSON.stringify(payload),
        )
        .catch((error: Error) =>
          log(`failed to publish ${stream}: ${error.message}`),
        );
    },
    close: () => redis.quit().catch(() => undefined),
  };
};

interface ReadParams<T> {
  redisUrl: string;
  stream: string;
  schema: ZodType<T>;
  handler: (payload: T) => void | Promise<void>;
}

// Пока чтение не остановлено, сбой логируется и цикл продолжается: падение
// процесса из-за недоступного Redis ничего бы не исправило.
const runLoop = async ({
  step,
  log,
  isStopped,
}: {
  step: () => Promise<void>;
  log: (message: string) => void;
  isStopped: () => boolean;
}) => {
  while (!isStopped())
    try {
      await step();
    } catch (error) {
      if (isStopped()) return;

      log((error as Error).message);
      await sleep(LOOP_ERROR_DELAY_MS);
    }
};

/**
 * Reads a stream as a consumer group: every event is handled by one instance
 * of the group, at least once.
 *
 * An event is acknowledged only after `handler` resolves. If the handler throws
 * or the process dies, the event stays pending and is claimed again after
 * `retryAfterMs` of idleness, so the handler must be idempotent. Events that
 * fail the schema are acknowledged and logged: retrying them cannot help.
 *
 * @returns `ready` resolves once the group exists; `close` stops reading.
 * @example
 * consumeGroup({ redisUrl, stream: "user.created", group: "boards", schema, handler });
 */
export const consumeGroup = <T>({
  redisUrl,
  stream,
  schema,
  handler,
  group,
  retryAfterMs = DEFAULT_RETRY_AFTER_MS,
}: ReadParams<T> & { group: string; retryAfterMs?: number }) => {
  const { redis, log } = connect(redisUrl, `Event consumer ${group}/${stream}`);
  const consumer = `${hostname()}-${randomUUID()}`;
  let stopped = false;

  const handle = async ([id, fields]: StreamEntry) => {
    const parsed = schema.safeParse(parsePayload(fields));

    if (!parsed.success) {
      log(`invalid payload on ${stream}: ${id}`);
      await redis.xack(stream, group, id);
      return;
    }

    try {
      await handler(parsed.data);
      await redis.xack(stream, group, id);
    } catch (error) {
      console.error(
        `Event ${stream} ${id} failed, will retry: ${(error as Error).message}`,
      );
    }
  };

  const handleAll = async (entries: StreamEntry[]) => {
    for (const entry of entries) await handle(entry);
  };

  // Сначала забираем зависшие события - упавшие в обработчике или оставшиеся
  // за умершим экземпляром, - потом ждём новые.
  const step = async () => {
    const [, claimed] = (await redis.xautoclaim(
      stream,
      group,
      consumer,
      retryAfterMs,
      "0-0",
      "COUNT",
      READ_BATCH_SIZE,
    )) as [string, StreamEntry[]];

    await handleAll(claimed);

    const response = (await redis.xreadgroup(
      "GROUP",
      group,
      consumer,
      "COUNT",
      READ_BATCH_SIZE,
      "BLOCK",
      READ_BLOCK_MS,
      "STREAMS",
      stream,
      ">",
    )) as [string, StreamEntry[]][] | null;

    if (response) await handleAll(response[0][1]);
  };

  // Группа создаётся с "0", а не с "$": события, отправленные до первого
  // запуска потребителя, тоже должны быть обработаны.
  const ready = redis
    .xgroup("CREATE", stream, group, "0", "MKSTREAM")
    .then(
      () => undefined,
      (error: Error) => {
        if (!error.message.includes("BUSYGROUP")) throw error;
      },
    );

  ready.then(
    () => runLoop({ step, log, isStopped: () => stopped }),
    (error: Error) => log(error.message),
  );

  return {
    ready,
    close: async () => {
      stopped = true;
      redis.disconnect();
    },
  };
};

/**
 * Reads a stream so that every running instance receives every event published
 * after it started. Suited for events about local state, such as open
 * connections, where each instance has to react on its own.
 *
 * The position is kept in memory: after a lost connection reading resumes where
 * it stopped, after a restart it starts from the newest event.
 *
 * @returns `ready` resolves once the starting position is fixed; `close` stops reading.
 */
export const readBroadcast = <T>({
  redisUrl,
  stream,
  schema,
  handler,
}: ReadParams<T>) => {
  const { redis, log } = connect(redisUrl, `Event reader ${stream}`);
  let stopped = false;
  let lastId = "0-0";

  const step = async () => {
    const response = (await redis.xread(
      "COUNT",
      READ_BATCH_SIZE,
      "BLOCK",
      READ_BLOCK_MS,
      "STREAMS",
      stream,
      lastId,
    )) as [string, StreamEntry[]][] | null;

    for (const [id, fields] of response?.[0][1] ?? []) {
      lastId = id;

      const parsed = schema.safeParse(parsePayload(fields));

      if (!parsed.success) {
        log(`invalid payload on ${stream}: ${id}`);
        continue;
      }

      try {
        await handler(parsed.data);
      } catch (error) {
        console.error(`Event ${stream} ${id} failed: ${(error as Error).message}`);
      }
    }
  };

  // Позиция - явный id последнего события, а не "$" в каждом вызове XREAD:
  // иначе события, пришедшие между двумя вызовами, терялись бы.
  const ready = redis
    .xrevrange(stream, "+", "-", "COUNT", 1)
    .then(([last]) => {
      if (last) lastId = last[0];
    });

  ready.then(
    () => runLoop({ step, log, isStopped: () => stopped }),
    (error: Error) => log(error.message),
  );

  return {
    ready,
    close: async () => {
      stopped = true;
      redis.disconnect();
    },
  };
};
