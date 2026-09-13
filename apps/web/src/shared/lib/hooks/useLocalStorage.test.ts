import { act, renderHook } from "@testing-library/react";

import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage hook", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  test("Должен возвращать initialValue и обновлять Storage при вызове setValue", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("default");

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");

    expect(window.localStorage.getItem("test-key")).toBe(
      JSON.stringify("new value"),
    );
  });

  test("Должен синхронизироваться между разными экземплярами с одним ключом", () => {
    const { result: res1 } = renderHook(() =>
      useLocalStorage("test-key", "default"),
    );
    const { result: res2 } = renderHook(() =>
      useLocalStorage("test-key", "default"),
    );

    act(() => {
      res1.current[1]("new value");
    });

    expect(res1.current[0]).toBe("new value");
    expect(res2.current[0]).toBe("new value");

    expect(window.localStorage.getItem("test-key")).toBe(
      JSON.stringify("new value"),
    );
  });
});
