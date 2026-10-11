jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => "#" + key,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock("@/entities/workspace/model/api", () => ({
  WorkspacesApi: { getAll: jest.fn() },
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PropsWithChildren } from "react";

import { WorkspacesApi } from "@/entities/workspace/model/api";

import { WorkspacesGrid } from "./WorkspacesGrid";

const workspace = (id: string) => ({
  workspace: {
    id,
    name: `Область ${id}`,
    ownerId: "u1",
    type: "team",
    accessLevel: "private",
    preview: null,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    boards: [],
    members: [],
  },
  accessRole: "OWNER",
});

function Providers({ children }: PropsWithChildren) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("WorkspacesGrid component", () => {
  beforeEach(() => {
    (WorkspacesApi.getAll as jest.Mock).mockReset();
  });

  test("Следующая страница догружается по кнопке и добавляется к уже показанным", async () => {
    const user = userEvent.setup();
    (WorkspacesApi.getAll as jest.Mock)
      .mockResolvedValueOnce({ items: [workspace("w1")], nextCursor: "w1" })
      .mockResolvedValueOnce({ items: [workspace("w2")], nextCursor: null });

    render(<WorkspacesGrid />, { wrapper: Providers });

    await user.click(
      await screen.findByRole("button", { name: "#workspace.load_more" }),
    );

    expect(await screen.findByText("Область w2")).toBeInTheDocument();
    expect(screen.getByText("Область w1")).toBeInTheDocument();
    expect(WorkspacesApi.getAll).toHaveBeenLastCalledWith(
      expect.objectContaining({ cursor: "w1" }),
    );
  });

  test("На последней странице кнопки догрузки нет", async () => {
    (WorkspacesApi.getAll as jest.Mock).mockResolvedValueOnce({
      items: [workspace("w1")],
      nextCursor: null,
    });

    render(<WorkspacesGrid />, { wrapper: Providers });

    expect(await screen.findByText("Область w1")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "#workspace.load_more" }),
    ).not.toBeInTheDocument();
  });
});
