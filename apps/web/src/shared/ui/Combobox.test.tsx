import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";

import { Combobox } from "./Combobox";

describe("Combobox component", () => {
  const mockItems = [
    { id: "1", label: "Option 1" },
    { id: "2", label: "Option 2" },
    { id: "3", label: "Option 3" },
  ] satisfies { id: string; label: string }[];

  const defaultProps: ComponentProps<
    typeof Combobox<(typeof mockItems)[number]>
  > = {
    items: mockItems,
    input: "",
    onInputChange: jest.fn(),
    onSelect: jest.fn(),
    renderItem: (item) => item.label,
    placeholder: "Select an option",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Должен рендерить без ошибок", () => {
    render(<Combobox {...defaultProps} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("Должен открывать список при фокусе на инпут", async () => {
    const user = userEvent.setup();

    render(<Combobox {...defaultProps} />);

    expect(screen.queryByRole("listbox")).toBeNull();

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(mockItems.length);
  });

  test("Должен закрывать список при клике вне компонента", async () => {
    const user = userEvent.setup();

    render(<Combobox {...defaultProps} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  test("Должен вызывать onSelect при выборе элемента", async () => {
    const user = userEvent.setup();

    render(<Combobox {...defaultProps} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const option2 = screen.getByRole("option", { name: "Option 2" });

    await user.hover(option2);

    expect(screen.getByRole("option", { name: "Option 2" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(option2);

    expect(option2).toHaveAttribute("aria-selected", "true");

    expect(screen.queryByRole("listbox")).toBeNull();

    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockItems[1]);
    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });

  test("Должен вызывать onSelect при выборе элемента с клавиатуры", async () => {
    const user = userEvent.setup();

    render(<Combobox {...defaultProps} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: "Option 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("[ArrowDown]");

    const option2 = screen.getByRole("option", { name: "Option 2" });

    expect(option2).toHaveAttribute("aria-selected", "true");

    await user.keyboard("[Enter]");

    expect(option2).toHaveAttribute("aria-selected", "true");

    expect(screen.queryByRole("listbox")).toBeNull();

    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockItems[1]);
    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });
});
