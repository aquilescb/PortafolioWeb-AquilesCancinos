import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import Home from "./home";

describe("Home route", () => {
  it("renders a single top-level heading", () => {
    render(<Home />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Aquiles Cancinos");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Home />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
