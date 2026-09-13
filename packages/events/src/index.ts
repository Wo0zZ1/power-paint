import Redis from "ioredis";
import type { ZodType } from "zod";

// Тонкая обёртка над Pub/Sub. Существует по двум причинам: у ioredis подписанное
// соединение не может выполнять обычные команды, поэтому публикация и подписка
// держат разные клиенты; и подписки надо восстанавливать при переподключении.

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

const clientOptions = {
  lazyConnect: true,
  retryStrategy: (attempt: number) => Math.min(attempt * 500, 10_000),
};

export const createPublisher = (redisUrl: string) => {
  const redis = new Redis(redisUrl, clientOptions);
  const log = logOnce("Event publisher");

  redis.on("error", (error) => log(error.message));

  void redis.connect().catch((error) => log(error.message));

  return {
    // Событие - уведомление, а не команда: недоставка не должна ронять операцию,
    // которая его породила. Поэтому ошибка логируется, а не пробрасывается.
    publish: async <T>(channel: string, payload: T) => {
      try {
        await redis.publish(channel, JSON.stringify(payload));
      } catch (error) {
        log(`failed to publish ${channel}: ${(error as Error).message}`);
      }
    },
    close: () => redis.quit().catch(() => undefined),
  };
};

export const createSubscriber = (redisUrl: string) => {
  const redis = new Redis(redisUrl, clientOptions);
  const log = logOnce("Event subscriber");
  const handlers = new Map<string, (raw: unknown) => void>();

  redis.on("error", (error) => log(error.message));

  // Подписки восстанавливаются на каждом подключении: Redis мог быть недоступен
  // при старте сервиса или отвалиться позже.
  redis.on("ready", () => {
    const channels = [...handlers.keys()];

    if (channels.length > 0)
      void redis.subscribe(...channels).catch((error) => log(error.message));
  });

  redis.on("message", (channel, message) => {
    const handler = handlers.get(channel);
    if (!handler) return;

    try {
      handler(JSON.parse(message));
    } catch (error) {
      log(`bad payload on ${channel}: ${(error as Error).message}`);
    }
  });

  return {
    connect: () => redis.connect().catch((error) => log(error.message)),

    // Схема проверяется на приёме: отправитель и получатель - разные процессы,
    // и доверять форме сообщения без проверки нельзя.
    subscribe: async <T>(
      channel: string,
      schema: ZodType<T>,
      handler: (payload: T) => void | Promise<void>,
    ) => {
      handlers.set(channel, (raw) => {
        const parsed = schema.safeParse(raw);

        if (!parsed.success) {
          log(`invalid payload on ${channel}`);
          return;
        }

        void handler(parsed.data);
      });

      if (redis.status === "ready")
        await redis.subscribe(channel).catch((error) => log(error.message));
    },

    close: () => redis.quit().catch(() => undefined),
  };
};
