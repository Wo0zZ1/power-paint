import type { IGuestUserCookie } from "@/shared/types";

import { encodeGuestUserCookie, parseGuestUserCookie } from "./guestUser";

describe("parseGuestUserCookie", () => {
  test("Должен читать куку, которую выдал proxy", () => {
    const guestUser: IGuestUserCookie = {
      name: ["Swift", "Lion"],
      color: "#b33c3c",
    };

    expect(parseGuestUserCookie(encodeGuestUserCookie(guestUser))).toEqual(
      guestUser,
    );
  });

  test("Битая кука не должна ронять страницу доски", () => {
    expect(parseGuestUserCookie("not-base64-json")).toBeNull();
  });

  test("Кука чужой формы считается отсутствующей", () => {
    const foreign = Buffer.from(JSON.stringify({ name: "Lion" })).toString(
      "base64",
    );

    expect(parseGuestUserCookie(foreign)).toBeNull();
  });
});
