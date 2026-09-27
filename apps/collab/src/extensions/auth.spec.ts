import type { onAuthenticatePayload } from "@hocuspocus/server";

import { onAuthenticate } from "./auth";

const BOARD_ID = "0b6f5c2e-3a4d-4e8f-9a1b-2c3d4e5f6a7b";

const authenticate = (documentName: string, userId?: string) =>
  onAuthenticate({
    documentName,
    requestHeaders: userId ? { "x-user-id": userId } : {},
    connectionConfig: { readOnly: false },
  } as unknown as onAuthenticatePayload);

const respondWith = (accessRole: string) =>
  jest
    .spyOn(global, "fetch")
    .mockResolvedValue({ ok: true, json: async () => ({ accessRole }) } as Response);

describe("onAuthenticate", () => {
  afterEach(() => jest.restoreAllMocks());

  test("Имя документа не должно попадать в запрос к boards сырым - иначе клиент подменит пользователя", async () => {
    const fetchMock = respondWith("OWNER");

    await expect(
      authenticate(`${BOARD_ID}/access?userId=owner#`, "attacker"),
    ).rejects.toThrow("Unauthorized");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("Должен спрашивать у boards роль этого пользователя на этой доске", async () => {
    const fetchMock = respondWith("EDITOR");

    await expect(authenticate(BOARD_ID, "user-1")).resolves.toEqual({
      accessRole: "EDITOR",
      userId: "user-1",
    });

    const url = new URL(String(fetchMock.mock.calls[0][0]));

    expect(url.pathname).toBe(`/internal/boards/${BOARD_ID}/access`);
    expect(url.searchParams.get("userId")).toBe("user-1");
  });

  test("Зависший boards не должен держать подключение - по тайм-ауту отказ", async () => {
    jest.spyOn(global, "fetch").mockImplementation(
      (_, init) =>
        new Promise((_resolve, reject) =>
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted"))),
        ),
    );

    await expect(authenticate(BOARD_ID, "user-1")).rejects.toThrow(
      "Unauthorized",
    );
  }, 1_000);
});
