import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock TanStack Router so createFileRoute doesn't blow up in jsdom
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => () => ({}),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock Wikipedia poster fetching to avoid real network calls
vi.mock("@/lib/wikipedia", () => ({
  enrichWithPosters: vi.fn().mockImplementation((items: unknown[]) =>
    Promise.resolve(items.map((t) => ({ ...(t as object), posterPath: null }))),
  ),
}));

// Import the named App export (not the Route)
import { App } from "../index";

describe("App quiz flow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the landing phase by default", () => {
    render(<App />);
    expect(screen.getByText(/What Should I Watch Tonight\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /begin/i })).toBeInTheDocument();
  });

  it("transitions to quiz phase and shows step 1 / 8 on start", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /begin/i }));
    expect(screen.getByText("1 / 8")).toBeInTheDocument();
    expect(screen.getByText(/How are you feeling tonight\?/i)).toBeInTheDocument();
  });

  it("back button is disabled on the first question", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /begin/i }));
    const backBtn = screen.getByRole("button", { name: /← back/i });
    expect(backBtn).toBeDisabled();
  });

  it("selecting an answer advances to question 2", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /begin/i }));
    await user.click(screen.getByRole("button", { name: /Happy & Upbeat/i }));
    await waitFor(() => expect(screen.getByText("2 / 8")).toBeInTheDocument());
    expect(screen.getByText(/What genre are you feeling\?/i)).toBeInTheDocument();
  });

  it("back button returns to the previous question", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /begin/i }));
    await user.click(screen.getByRole("button", { name: /Happy & Upbeat/i }));
    await waitFor(() => screen.getByText("2 / 8"));
    await user.click(screen.getByRole("button", { name: /← back/i }));
    expect(screen.getByText("1 / 8")).toBeInTheDocument();
  });

  it("shows loading phase after answering all 8 questions", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /begin/i }));

    for (let i = 0; i < 8; i++) {
      const allButtons = screen.getAllByRole("button");
      const answerBtn = allButtons.find(
        (b) => !b.textContent?.includes("Back") && !b.textContent?.includes("Begin"),
      );
      expect(answerBtn).toBeDefined();
      await user.click(answerBtn!);
      if (i < 7) {
        await waitFor(() => screen.getByText(`${i + 2} / 8`));
      }
    }

    await waitFor(() =>
      expect(screen.getByText(/Curating your screening/i)).toBeInTheDocument(),
    );
  });

  it("New Screening button resets to landing", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /begin/i }));

    for (let i = 0; i < 8; i++) {
      const allButtons = screen.getAllByRole("button");
      const answerBtn = allButtons.find(
        (b) => !b.textContent?.includes("Back") && !b.textContent?.includes("Begin"),
      );
      await user.click(answerBtn!);
      if (i < 7) await waitFor(() => screen.getByText(`${i + 2} / 8`));
    }

    await waitFor(() => screen.getByText(/New Screening/i), { timeout: 5000 });
    await user.click(screen.getByRole("button", { name: /New Screening/i }));

    expect(screen.getByText(/What Should I Watch Tonight\?/i)).toBeInTheDocument();
  });
});
