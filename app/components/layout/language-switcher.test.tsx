import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { LanguageSwitcher } from "./language-switcher";

describe("LanguageSwitcher", () => {
  it("marks the current locale and links to the other one", () => {
    render(
      <MemoryRouter initialEntries={["/es"]}>
        <LanguageSwitcher />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
  });

  it("falls back to the target locale's home for a path with no matching route key", () => {
    render(
      <MemoryRouter initialEntries={["/es/unknown"]}>
        <LanguageSwitcher />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/en"]}>
        <LanguageSwitcher />
      </MemoryRouter>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
