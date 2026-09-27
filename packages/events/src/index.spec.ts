import { randomUUID } from "node:crypto";

import Redis from "ioredis";
import { z } from "zod";

import { consumeGroup, createPublisher, readBroadcast } from "./index";

// Гарантии доставки - это поведение Redis Streams, а не нашего кода, и мок
// проверял бы только сам себя. Набор требует живого Redis и включается флагом.
const describeIntegration =
  process.env.RUN_INTEGRATION_TESTS === "true" ? describe : describe.skip;

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const schema = z.object({ n: z.number() });

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitFor = async (condition: () => boolean, timeoutMs = 5_000) => {
  const deadline = Date.now() + timeoutMs;

  while (!condition()) {
    if (Date.now() > deadline) throw new Error("waitFor: timeout");
    await sleep(20);
  }
};

describeIntegration("events (нужен живой Redis)", () => {
  const closers: (() => Promise<unknown>)[] = [];

  let publisher: ReturnType<typeof createPublisher>;
  let redis: Redis;
  let stream: string;

  beforeAll(() => {
    publisher = createPublisher(REDIS_URL);
    redis = new Redis(REDIS_URL);
  });

  beforeEach(() => {
    stream = `test:${randomUUID()}`;
  });

  afterEach(async () => {
    await Promise.all(closers.splice(0).map((close) => close()));
  });

  afterAll(async () => {
    await publisher.close();
    await redis.quit();
  });

  const startGroup = async (
    handler: (payload: { n: number }) => Promise<void>,
    retryAfterMs?: number,
  ) => {
    const consumer = consumeGroup({
      redisUrl: REDIS_URL,
      stream,
      group: "test",
      schema,
      handler,
      retryAfterMs,
    });

    closers.push(consumer.close);
    await consumer.ready;
  };

  test("Событие, опубликованное до запуска потребителя, всё равно обрабатывается", async () => {
    const received: number[] = [];

    publisher.publish(stream, { n: 1 });
    await sleep(200);

    await startGroup(async ({ n }) => void received.push(n));

    await waitFor(() => received.length === 1);
    expect(received).toEqual([1]);
  });

  test("Если обработчик упал, событие обрабатывается повторно", async () => {
    let attempts = 0;

    await startGroup(async () => {
      attempts++;
      if (attempts === 1) throw new Error("временный сбой");
    }, 100);

    publisher.publish(stream, { n: 1 });

    await waitFor(() => attempts === 2);
  });

  test("Обработанное событие подтверждается и больше не висит в ожидании", async () => {
    let handled = 0;

    await startGroup(async () => void handled++);
    publisher.publish(stream, { n: 1 });

    await waitFor(() => handled === 1);
    await sleep(100);

    const [pending] = (await redis.xpending(stream, "test")) as [number];
    expect(pending).toBe(0);
  });

  test("Некорректное событие подтверждается и не мешает следующим", async () => {
    const received: number[] = [];

    await startGroup(async ({ n }) => void received.push(n));

    await redis.xadd(stream, "*", "payload", JSON.stringify({ n: "не число" }));
    publisher.publish(stream, { n: 2 });

    await waitFor(() => received.length === 1);
    await sleep(100);

    const [pending] = (await redis.xpending(stream, "test")) as [number];
    expect(received).toEqual([2]);
    expect(pending).toBe(0);
  });

  test("Экземпляры в одной группе делят события, а не дублируют их", async () => {
    const received: number[] = [];

    await startGroup(async ({ n }) => void received.push(n));
    await startGroup(async ({ n }) => void received.push(n));

    for (let n = 0; n < 10; n++) publisher.publish(stream, { n });

    await waitFor(() => received.length === 10);
    await sleep(200);

    expect(received.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("Широковещательное событие получает каждый экземпляр", async () => {
    const first: number[] = [];
    const second: number[] = [];

    for (const received of [first, second]) {
      const reader = readBroadcast({
        redisUrl: REDIS_URL,
        stream,
        schema,
        handler: ({ n }) => void received.push(n),
      });

      closers.push(reader.close);
      await reader.ready;
    }

    publisher.publish(stream, { n: 1 });

    await waitFor(() => first.length === 1 && second.length === 1);
  });

  test("Широковещательный читатель не получает старые события", async () => {
    const received: number[] = [];

    publisher.publish(stream, { n: 1 });
    await sleep(200);

    const reader = readBroadcast({
      redisUrl: REDIS_URL,
      stream,
      schema,
      handler: ({ n }) => void received.push(n),
    });

    closers.push(reader.close);
    await reader.ready;

    publisher.publish(stream, { n: 2 });

    await waitFor(() => received.length === 1);
    expect(received).toEqual([2]);
  });
});
