/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { GUEST_USER_COOKIE_NAME } from "@/shared/constants";

import { proxy } from "../proxy";

const forwardedCookie = (response: Response) =>
  response.headers
    .get("x-middleware-request-cookie")
    ?.match(new RegExp(`${GUEST_USER_COOKIE_NAME}=([^;]+)`))?.[1];

describe("proxy", () => {
  test("Кука нового гостя должна дойти и до страницы - иначе имя на доске сменится после перезагрузки", async () => {
    const response = await proxy(new NextRequest("http://localhost/boards/1"));

    const issued = response.cookies.get(GUEST_USER_COOKIE_NAME)?.value;

    expect(issued).toBeDefined();
    expect(forwardedCookie(response)).toBe(encodeURIComponent(issued!));
  });

  test("Битую куку гостя proxy должен заменить", async () => {
    const request = new NextRequest("http://localhost/boards/1", {
      headers: { cookie: `${GUEST_USER_COOKIE_NAME}=broken` },
    });

    const response = await proxy(request);

    expect(response.cookies.get(GUEST_USER_COOKIE_NAME)?.value).not.toBe(
      "broken",
    );
  });
});
