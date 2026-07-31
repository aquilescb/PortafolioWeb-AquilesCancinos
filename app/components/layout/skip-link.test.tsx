import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("points to the main content landmark", () => {
    render(
      <MemoryRouter initialEntries={["/en"]}>
        <SkipLink />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /skip to content/i }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("renders the localized label at a /es path", () => {
    render(
      <MemoryRouter initialEntries={["/es"]}>
        <SkipLink />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /saltar al contenido/i }),
    ).toBeInTheDocument();
  });
});
