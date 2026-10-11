jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    ["#" + key, values?.color].filter(Boolean).join(" "),
}));

jest.mock("@/shared/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: jest.fn(), isUploading: false }),
}));

jest.mock("@/features/switch-language", () => ({
  changeLocaleAction: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DEFAULT_USER_COLORS } from "@/shared/constants";

import { SignupFormStep2 } from "./SignupFormStep2";

const [firstColor, secondColor] = DEFAULT_USER_COLORS;

// Цвет кнопки инвертируется под тему, а jsdom не знает matchMedia
window.matchMedia = jest.fn().mockReturnValue({
  matches: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

function Form({ children }: PropsWithChildren) {
  const form = useForm({
    defaultValues: {
      phone: "",
      locale: "ru",
      preferredColor: firstColor,
      image: "",
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

describe("SignupFormStep2 component", () => {
  test("Кнопки цвета называют свой цвет - иначе скринридер читает безымянные кнопки", () => {
    render(<SignupFormStep2 />, { wrapper: Form });

    for (const color of DEFAULT_USER_COLORS)
      expect(
        screen.getByRole("button", {
          name: `#preferred_color.option ${color}`,
        }),
      ).toBeInTheDocument();
  });

  test("Выбранный цвет отмечен как нажатый", async () => {
    const user = userEvent.setup();
    render(<SignupFormStep2 />, { wrapper: Form });

    const second = screen.getByRole("button", {
      name: `#preferred_color.option ${secondColor}`,
    });

    await user.click(second);

    expect(second).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", {
        name: `#preferred_color.option ${firstColor}`,
      }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
