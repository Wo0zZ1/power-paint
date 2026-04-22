jest.mock("next-intl", () => ({
  useTranslations: (_prefix: string) => (key: string) => "#" + key,
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/entities/workspace/model/mutations", () => ({
  useCreateWorkspaceMutation: jest.fn(),
}));

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/shared/config";

import { useCreateWorkspaceMutation } from "@/entities/workspace/model/mutations";

import { CreateWorkspaceModal } from "./CreateWorkspaceModal";

describe("CreateWorkspaceModal component", () => {
  const mockPush = jest.fn();
  const mockMutateAsync = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useCreateWorkspaceMutation as jest.Mock).mockReturnValue({
      isPending: false,
      mutateAsync: mockMutateAsync,
    });
  });

  test("Кнопка отображает спиннер и дизейблится при отправке", async () => {
    (useCreateWorkspaceMutation as jest.Mock).mockReturnValue({
      isPending: true,
      mutateAsync: mockMutateAsync,
    });

    render(
      <CreateWorkspaceModal open={true} onOpenChange={mockOnOpenChange} />,
    );

    const submitButton = screen.getByRole("button", {
      name: /#creating/,
    });
    const { getByRole } = within(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("#creating");

    expect(getByRole("status")).toBeInTheDocument();
  });

  test("Флоу: успешное создание Workspace", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValue({ workspace: { id: "123-abc" } });

    render(
      <CreateWorkspaceModal open={true} onOpenChange={mockOnOpenChange} />,
    );

    const submitButton = screen.getByRole("button", { name: "#create" });

    expect(submitButton).toBeDisabled();

    await user.type(
      screen.getByRole("textbox", {
        name: "#workspace.create.inputLabel",
      }),
      "My New Workspace",
    );

    expect(submitButton).not.toBeDisabled();

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "My New Workspace",
      });

      expect(mockPush).toHaveBeenCalledWith(
        ROUTES.DASHBOARD.WORKSPACE("123-abc"),
      );

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  test("Флоу: ошибка создания Workspace из-за короткого названия", async () => {
    const user = userEvent.setup();

    render(
      <CreateWorkspaceModal open={true} onOpenChange={mockOnOpenChange} />,
    );

    const button = screen.getByRole("button", { name: "#create" });

    expect(button).toBeDisabled();

    await user.type(
      screen.getByRole("textbox", { name: "#workspace.create.inputLabel" }),
      "a",
    );

    expect(
      screen.getByText("#workspace.errors.name_too_short"),
    ).toBeInTheDocument();

    expect(button).toBeDisabled();

    await user.click(button);

    await waitFor(() => {
      expect(mockMutateAsync).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });
  });

  test("Флоу: ошибка создания Workspace из-за длунного названия", async () => {
    const user = userEvent.setup();

    render(
      <CreateWorkspaceModal open={true} onOpenChange={mockOnOpenChange} />,
    );

    const button = screen.getByRole("button", { name: "#create" });

    expect(button).toBeDisabled();

    await user.type(
      screen.getByRole("textbox", { name: "#workspace.create.inputLabel" }),
      "a".repeat(50),
    );

    expect(
      screen.getByText("#workspace.errors.name_too_long"),
    ).toBeInTheDocument();

    expect(button).toBeDisabled();

    await user.click(button);

    await waitFor(() => {
      expect(mockMutateAsync).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });
  });
});
