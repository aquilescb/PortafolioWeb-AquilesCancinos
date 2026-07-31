import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("points to the main content landmark", () => {
    render(<SkipLink />);

    expect(
      screen.getByRole("link", { name: /skip to content/i }),
    ).toHaveAttribute("href", "#main-content");
  });
});
