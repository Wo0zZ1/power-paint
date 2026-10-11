import { fetchSession } from "./api";

const fetchMock = jest.fn();

const respond = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

describe("fetchSession", () => {
  test("Без сессии возвращает null", async () => {
    fetchMock.mockResolvedValueOnce(respond(401));

    await expect(fetchSession({})).resolves.toBeNull();
  });

  test("Склеивает личность и профиль", async () => {
    fetchMock
      .mockResolvedValueOnce(respond(200, { id: "u1", role: "user" }))
      .mockResolvedValueOnce(respond(200, { id: "u1", name: "Максим" }));

    await expect(fetchSession({})).resolves.toEqual({
      id: "u1",
      name: "Максим",
      role: "user",
    });
  });

  test.each([429, 500, 503])(
    "Ответ %i не значит, что пользователь вышел - иначе его выбросит на страницу входа",
    async (status) => {
      fetchMock.mockResolvedValueOnce(respond(status));

      await expect(fetchSession({})).rejects.toThrow();
    },
  );

  test("Недоступный профиль тоже не значит выход", async () => {
    fetchMock
      .mockResolvedValueOnce(respond(200, { id: "u1", role: "user" }))
      .mockResolvedValueOnce(respond(503));

    await expect(fetchSession({})).rejects.toThrow();
  });
});
