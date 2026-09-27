import { BoardsApi } from "./api";

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({}) });
  global.fetch = fetchMock;
});

const sentContentType = () =>
  new Headers(fetchMock.mock.calls[0][1].headers).get("Content-Type");

describe("BoardsApi", () => {
  test("Должен отправлять новую доску как JSON - без заголовка сервис досок не разберёт тело", async () => {
    await BoardsApi.createOne({ name: "Доска", workspaceId: "ws" });

    expect(sentContentType()).toBe("application/json");
  });

  test("Должен отправлять изменения доски как JSON", async () => {
    await BoardsApi.updateOne({ boardId: "b", data: { name: "Доска" } });

    expect(sentContentType()).toBe("application/json");
  });
});
