jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => "#" + key,
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname, useRouter } from "next/navigation";

import { DialogContent, DialogDescription, DialogTitle } from "@/shared/ui";

import Layout from "../app/@modal/layout";

const Modal = () => (
  <DialogContent>
    <DialogTitle>Сброс пароля</DialogTitle>
    <DialogDescription>Код из письма</DialogDescription>
  </DialogContent>
);

describe("Modal slot layout", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });
  });

  test("Закрытая модалка снова открывается при следующем переходе на неё", async () => {
    (usePathname as jest.Mock).mockReturnValue("/reset-password");
    const { rerender } = render(
      <Layout>
        <Modal />
      </Layout>,
    );

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    (usePathname as jest.Mock).mockReturnValue("/signin");
    rerender(<Layout>{null}</Layout>);

    (usePathname as jest.Mock).mockReturnValue("/reset-password");
    rerender(
      <Layout>
        <Modal />
      </Layout>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
