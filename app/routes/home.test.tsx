import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import Home from "./home";

describe("Home route", () => {
  it("renders a single top-level heading", () => {
    render(
      <MemoryRouter initialEntries={["/es"]}>
        <Home />
      </MemoryRouter>,
    );

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Aquiles Cancinos");
  });

  it("renders the Spanish copy at /es", () => {
    render(
      <MemoryRouter initialEntries={["/es"]}>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/vista previa del sistema de diseño/i),
    ).toBeInTheDocument();
  });

  it("renders the English copy at /en", () => {
    render(
      <MemoryRouter initialEntries={["/en"]}>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByText(/design system preview/i)).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/es"]}>
        <Home />
      </MemoryRouter>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
