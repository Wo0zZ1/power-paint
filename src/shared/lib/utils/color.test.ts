import { normalizeHexColor } from "./color";

describe("normalizeHexColor function", () => {
  test("Должна оставить нормализованный hex цвет без изменений", () => {
    const hexColor = "#1a2b3c";
    expect(normalizeHexColor(hexColor)).toBe(hexColor);
  });

  test("Должна добавить # в начале hex цвета, если его нет", () => {
    const hexColor = "1a2b3c";
    expect(normalizeHexColor(hexColor)).toBe("#1a2b3c");
  });

  test("Должна нормализовать сокращенный hex цвет", () => {
    const hexColor = "#abc";
    expect(normalizeHexColor(hexColor)).toBe("#aabbcc");
  });

  test("Должна нормализовать сокращенный hex цвет без #", () => {
    const hexColor = "abc";
    expect(normalizeHexColor(hexColor)).toBe("#aabbcc");
  });

  test("Должна бросить ошибку, если передан некорректный hex цвет", () => {
    const invalidHexColor = "red";
    expect(() => normalizeHexColor(invalidHexColor)).toThrow(
      "Invalid hex color format",
    );
  });
});
