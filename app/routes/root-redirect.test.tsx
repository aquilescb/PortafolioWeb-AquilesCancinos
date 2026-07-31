import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import RootRedirect, { meta } from "./root-redirect";

describe("root-redirect route", () => {
  it("links both fallback messages to the default locale home", () => {
    render(<RootRedirect />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/es");
    }
  });

  it("declares the canonical link, a meta refresh and noindex", () => {
    const tags = meta({} as Parameters<typeof meta>[0]);

    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "/es",
    });
    expect(tags).toContainEqual({
      httpEquiv: "refresh",
      content: "0; url=/es",
    });
    expect(tags).toContainEqual({ name: "robots", content: "noindex" });
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<RootRedirect />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
