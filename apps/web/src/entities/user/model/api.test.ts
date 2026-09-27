import { UsersApi } from "./api";

describe("UsersApi", () => {
  test("Поиск должен передавать строку в параметре query - его и ждёт users", async () => {
    // В jsdom своего fetch нет, подменять нечего - подставляем целиком.
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [] });
    global.fetch = fetchMock;

    await UsersApi.getAll({ query: "ann" });

    const url = new URL(String(fetchMock.mock.calls[0][0]), "http://localhost");

    expect(url.searchParams.get("query")).toBe("ann");
  });
});
