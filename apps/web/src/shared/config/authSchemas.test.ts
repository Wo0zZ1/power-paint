import { resetPasswordSchema, signinSchema } from "./authSchemas";

describe("authSchemas", () => {
  test("Должен возвращать ключ i18n, а не готовый текст ошибки", () => {
    const result = signinSchema.safeParse({ email: "x", password: "" });

    expect(result.error?.issues[0].message).toBe("auth.errors.invalid_email");
  });

  test("Должен возвращать ключ при несовпадении паролей", () => {
    const result = resetPasswordSchema.safeParse({
      password: "secret1",
      passwordConfirm: "secret2",
    });

    expect(result.error?.issues[0].message).toBe(
      "auth.errors.passwords_do_not_match",
    );
  });
});
