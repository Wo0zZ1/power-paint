import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";

describe("Checkbox component", () => {
  test("Должен рендерить без ошибок", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  test("Должен рендерить с дополнительными классами", () => {
    render(<Checkbox className="custom-class" />);

    expect(screen.getByRole("checkbox")).toHaveClass("custom-class");
  });

  test("Должен менять состояние при клике", async () => {
    const user = userEvent.setup();
    const mock = jest.fn();

    render(<Checkbox onCheckedChange={mock} />);

    await user.click(screen.getByRole("checkbox"));

    expect(mock).toHaveBeenCalledWith<[boolean]>(true);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  test("Не должен менять состояние при клике с disabled", async () => {
    const user = userEvent.setup();
    const mock = jest.fn();

    render(<Checkbox disabled onCheckedChange={mock} />);

    await user.click(screen.getByRole("checkbox"));

    expect(mock).not.toHaveBeenCalled();
  });

  test("Должен вернуться в исходное состояние при двойном клике", async () => {
    const user = userEvent.setup();
    const mock = jest.fn();

    render(<Checkbox onCheckedChange={mock} />);

    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("checkbox"));

    expect(mock).toHaveBeenNthCalledWith<[boolean]>(1, true);
    expect(mock).toHaveBeenNthCalledWith<[boolean]>(2, false);
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
