import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { ContactEmail } from "./contact-email";

function renderEmail(user = "aquiles", domain = "example.com") {
  return render(
    <MemoryRouter initialEntries={["/es"]}>
      <ContactEmail user={user} domain={domain} />
    </MemoryRouter>,
  );
}

describe("ContactEmail", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn() },
      configurable: true,
    });
  });

  // Guards against a leaked fake-timer state if the "reverts" test below
  // throws before reaching its own `vi.useRealTimers()` call — otherwise a
  // failure there hangs every test that runs after it in this file.
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows an obfuscated label instead of the bare email address", () => {
    renderEmail();

    expect(
      screen.getByText("aquiles [at] example [dot] com"),
    ).toBeInTheDocument();
    expect(screen.queryByText("aquiles@example.com")).not.toBeInTheDocument();
  });

  it("sets a real mailto href on the label", () => {
    renderEmail();

    expect(
      screen.getByRole("link", { name: "aquiles [at] example [dot] com" }),
    ).toHaveAttribute("href", "mailto:aquiles@example.com");
  });

  it("copies the real address to the clipboard and confirms it", async () => {
    renderEmail();

    fireEvent.click(screen.getByRole("button", { name: "Copiar email" }));

    expect(
      await screen.findByRole("button", { name: "¡Copiado!" }),
    ).toBeInTheDocument();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "aquiles@example.com",
    );
  });

  it("reverts the confirmation back to the copy label after a few seconds", async () => {
    vi.useFakeTimers();
    renderEmail();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copiar email" }));
    });
    expect(
      screen.getByRole("button", { name: "¡Copiado!" }),
    ).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(
      screen.getByRole("button", { name: "Copiar email" }),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderEmail();

    expect(await axe(container)).toHaveNoViolations();
  });
});
