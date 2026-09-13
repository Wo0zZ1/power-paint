import { act, renderHook } from "@testing-library/react";

import { useDebounceFn } from "./useDebounceFn";

describe("useDebounceFn hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("Должен вызывать функцию после задержки", () => {
    const mock = jest.fn();

    const { result } = renderHook(() => useDebounceFn(mock, 500));

    expect(mock).toHaveBeenCalledTimes(0);

    result.current("test");

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(mock).toHaveBeenCalledTimes(0);

    act(() => {
      jest.runAllTimers();
    });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("test");
  });
});
