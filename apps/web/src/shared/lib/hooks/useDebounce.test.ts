import { act, renderHook } from "@testing-library/react";

import { useDebounce } from "./useDebounce";

describe("useDebounce hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Должен обновлять значение после задержки", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "first", delay: 500 },
      },
    );

    expect(result.current).toBe("first");

    rerender({ value: "second", delay: 500 });

    expect(result.current).toBe("first");

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(result.current).toBe("first");

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current).toBe("second");
  });
});
