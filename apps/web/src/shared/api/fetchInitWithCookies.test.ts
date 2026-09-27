import { fetchInitWithCookies } from "./fetchInitWithCookies";

describe("fetchInitWithCookies", () => {
  test("Должен передавать куки при серверном рендеринге", () => {
    expect(fetchInitWithCookies({ cookieString: "sid=1" }).headers).toEqual({
      Cookie: "sid=1",
    });
  });

  test("Должен пробрасывать адрес клиента, чтобы лимиты считались по нему, а не по Web", () => {
    expect(
      fetchInitWithCookies({ forwardedFor: "203.0.113.9" }).headers,
    ).toEqual({ "X-Forwarded-For": "203.0.113.9" });
  });

  test("Без куки и адреса заголовков нет", () => {
    expect(fetchInitWithCookies().headers).toBeUndefined();
  });
});
