import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import Home from "./home";

describe("Home route", () => {
  it("renders a single top-level heading", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Aquiles Cancinos");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
