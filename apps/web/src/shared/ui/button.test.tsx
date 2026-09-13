import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

describe("Button component", () => {
  test("Должен рендерить переданный текст", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" }),
    ).toBeInTheDocument();
  });

  test("Должен вызвать handler 1 раз при клике", async () => {
    const user = userEvent.setup();
    const mock = jest.fn();

    render(<Button onClick={mock}>Click me</Button>);

    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(mock).toHaveBeenCalledTimes(1);
  });

  test("Должнен быть неактивным при disabled", async () => {
    const user = userEvent.setup();
    const mock = jest.fn();

    render(
      <Button disabled onClick={mock}>
        Click me
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Click me" }));

    expect(mock).not.toHaveBeenCalled();
  });
});
