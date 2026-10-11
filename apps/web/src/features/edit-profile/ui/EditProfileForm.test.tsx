jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => "#" + key,
}));

const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("@/shared/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: jest.fn(), isUploading: false }),
}));

jest.mock("@/entities/user/model/api", () => ({
  UsersApi: { updateOne: jest.fn() },
}));

import type { OwnProfile } from "@power-paint/contracts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PropsWithChildren } from "react";

import { UsersApi } from "@/entities/user/model/api";

import { EditProfileForm } from "./EditProfileForm";

// Цвет кнопки инвертируется под тему, а jsdom не знает matchMedia
window.matchMedia = jest.fn().mockReturnValue({
  matches: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

const profile: OwnProfile = {
  id: "u1",
  name: "Анна",
  email: "anna@example.test",
  image: null,
  phone: null,
  locale: "ru",
  preferredColor: "#ff4545",
  created_at: new Date(),
};

function Providers({ children }: PropsWithChildren) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("EditProfileForm component", () => {
  beforeEach(() => {
    (UsersApi.updateOne as jest.Mock).mockReset().mockResolvedValue(profile);
    refresh.mockReset();
  });

  test("Пока ничего не изменено, сохранять нечего", () => {
    render(<EditProfileForm profile={profile} />, { wrapper: Providers });

    expect(
      screen.getByRole("button", { name: "#profile.save" }),
    ).toBeDisabled();
  });

  test("Изменённое имя уходит в профиль, а страница перечитывает сессию для шапки", async () => {
    const user = userEvent.setup();
    render(<EditProfileForm profile={profile} />, { wrapper: Providers });

    const name = screen.getByRole("textbox", { name: "#profile.name" });
    await user.clear(name);
    await user.type(name, "Анна Петрова");
    await user.click(screen.getByRole("button", { name: "#profile.save" }));

    await waitFor(() => expect(refresh).toHaveBeenCalled());
    expect((UsersApi.updateOne as jest.Mock).mock.calls[0][0]).toEqual({
      userId: "u1",
      data: expect.objectContaining({ name: "Анна Петрова", phone: null }),
    });
  });

  test("Пустое имя не отправляется и подсвечивается ошибкой", async () => {
    const user = userEvent.setup();
    render(<EditProfileForm profile={profile} />, { wrapper: Providers });

    await user.clear(screen.getByRole("textbox", { name: "#profile.name" }));
    await user.click(screen.getByRole("button", { name: "#profile.save" }));

    expect(
      await screen.findByText("#settings.errors.name_too_short"),
    ).toBeInTheDocument();
    expect(UsersApi.updateOne).not.toHaveBeenCalled();
  });
});
