import { render, screen } from "@testing-library/react";

import { Badge } from "./badge";

describe("Badge component", () => {
  test("Должен рендерить переданный текст", () => {
    const text = "Test Badge";

    render(<Badge>{text}</Badge>);

    const badgeElement = screen.getByText(text);

    expect(badgeElement).toBeInTheDocument();
  });

  test("Должен рендерить default вариант", () => {
    render(<Badge>Badge</Badge>);

    const badgeElement = screen.getByText("Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass("bg-primary", "text-primary-foreground");
  });

  test("Должен рендерить secondary вариант", () => {
    render(<Badge variant={"secondary"}>Badge</Badge>);

    const badgeElement = screen.getByText("Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass(
      "bg-secondary",
      "text-secondary-foreground",
    );
  });

  test("Должен рендерить destructive вариант", () => {
    render(<Badge variant={"destructive"}>Badge</Badge>);

    const badgeElement = screen.getByText("Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass(/destructive/);
  });

  test("Должен рендерить outline вариант", () => {
    render(<Badge variant={"outline"}>Badge</Badge>);

    const badgeElement = screen.getByText("Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass("border-border");
  });

  test("Должен рендерить ghost вариант", () => {
    render(<Badge variant={"ghost"}>Badge</Badge>);

    const badgeElement = screen.getByText("Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).not.toHaveClass("bg-primary");
  });

  test("Должен рендерить link вариант", () => {
    render(<Badge variant={"link"}>Badge</Badge>);
    const badgeElement = screen.getByText("Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass(/underline/);
  });

  test("Должен рендерить с дополнительными классами", () => {
    render(<Badge className="custom-class">Badge</Badge>);

    const badgeElement = screen.getByText("Badge");

    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass("custom-class");
  });
});
