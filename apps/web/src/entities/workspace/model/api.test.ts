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
});
