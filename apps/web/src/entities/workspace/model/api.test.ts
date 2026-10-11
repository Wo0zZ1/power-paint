import { WorkspacesApi } from "./api";

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({}) });
  global.fetch = fetchMock;
});

const sentContentType = () =>
  new Headers(fetchMock.mock.calls[0][1].headers).get("Content-Type");

describe("WorkspacesApi", () => {
  test("Должен отправлять новую область как JSON - без заголовка сервис досок не разберёт тело", async () => {
    await WorkspacesApi.createOne({ name: "Область" });

    expect(sentContentType()).toBe("application/json");
  });

  test("Должен отправлять изменения области как JSON", async () => {
    await WorkspacesApi.updateOne({
      workspaceId: "w",
      data: { name: "Область" },
    });

    expect(sentContentType()).toBe("application/json");
  });

  test("Страница запрашивается с лимитом и курсором - их ждёт сервис досок", async () => {
    await WorkspacesApi.getAll({ type: "team", limit: 12, cursor: "w-12" });

    const url = new URL(String(fetchMock.mock.calls[0][0]), "http://localhost");

    expect(url.searchParams.get("type")).toBe("team");
    expect(url.searchParams.get("limit")).toBe("12");
    expect(url.searchParams.get("cursor")).toBe("w-12");
  });
});
