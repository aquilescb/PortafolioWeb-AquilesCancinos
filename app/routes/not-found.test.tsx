import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import NotFound, { meta } from "./not-found";

function metaArgs(pathname: string) {
  return {
    location: { pathname },
    params: {},
    matches: [],
    loaderData: undefined,
  } as unknown as Parameters<typeof meta>[0];
}

describe("not-found route", () => {
  it("renders the Spanish message at an /es path", () => {
    render(
      <MemoryRouter initialEntries={["/es/does-not-exist"]}>
        <NotFound />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Página no encontrada" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Volver al inicio" }),
    ).toHaveAttribute("href", "/es");
  });

  it("renders the English message at an /en path", () => {
    render(
      <MemoryRouter initialEntries={["/en/does-not-exist"]}>
        <NotFound />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute(
      "href",
      "/en",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/es/does-not-exist"]}>
        <NotFound />
      </MemoryRouter>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("marks the page noindex", () => {
    const tags = meta(metaArgs("/es/does-not-exist"));

    expect(tags).toContainEqual({ name: "robots", content: "noindex" });
  });
});
