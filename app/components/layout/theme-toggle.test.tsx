import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "./theme-toggle";

function renderToggle(locale: "es" | "en" = "en") {
  return render(
    <MemoryRouter initialEntries={[`/${locale}`]}>
      <ThemeToggle />
    </MemoryRouter>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("starts reflecting the light theme already applied to the document", () => {
    renderToggle();

    expect(
      screen.getByRole("button", { name: /switch to dark theme/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("switches to dark, applies the class and persists the choice", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(
      screen.getByRole("button", { name: /switch to dark theme/i }),
    );

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: /switch to light theme/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("switches back to light on a second click", async () => {
    const user = userEvent.setup();
    renderToggle();

    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("labels the control in Spanish at a /es path", () => {
    renderToggle("es");

    expect(
      screen.getByRole("button", { name: /cambiar a tema oscuro/i }),
    ).toBeInTheDocument();
  });
});
