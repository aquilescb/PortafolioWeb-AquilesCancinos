import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Footer } from "./footer";

describe("Footer", () => {
  it("shows the current year and the site owner's name", () => {
    render(<Footer />);

    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toHaveTextContent(
      "Aquiles Cancinos",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Footer />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
