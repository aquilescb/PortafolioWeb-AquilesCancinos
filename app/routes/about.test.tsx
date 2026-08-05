import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import type { ContactInfo } from "@content";

import About, { meta } from "./about";

const contact: ContactInfo = {
  emailUser: "aquiles",
  emailDomain: "example.com",
  socials: [
    { url: "https://github.com/example", label: "GitHub", kind: "profile" },
    {
      url: "https://www.linkedin.com/in/example/",
      label: "LinkedIn",
      kind: "profile",
    },
  ],
};

function metaArgs(pathname: string) {
  return {
    location: { pathname },
    params: {},
    matches: [],
    loaderData: undefined,
  } as unknown as Parameters<typeof meta>[0];
}

function renderAbout(initialEntry: string, data: ContactInfo = contact) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn() },
    configurable: true,
  });
  const Stub = createRoutesStub([
    {
      path: "/es/sobre-mi",
      Component: About,
      loader: () => ({ contact: data }),
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("About route", () => {
  it("renders a single top-level heading", async () => {
    renderAbout("/es/sobre-mi");

    const headings = await screen.findAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Sobre mí");
  });

  it("renders the bio copy", async () => {
    renderAbout("/es/sobre-mi");

    expect(
      await screen.findByText(/estudiante avanzado de ingeniería informática/i),
    ).toBeInTheDocument();
  });

  it("renders the contact email and social links", async () => {
    renderAbout("/es/sobre-mi");

    expect(
      await screen.findByRole("link", { name: /aquiles \[at\] example/ }),
    ).toHaveAttribute("href", "mailto:aquiles@example.com");
    expect(screen.getByRole("link", { name: /^GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/example",
    );
    expect(screen.getByRole("link", { name: /^LinkedIn/ })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/example/",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderAbout("/es/sobre-mi");
    await screen.findAllByRole("heading", { level: 1 });

    expect(await axe(container)).toHaveNoViolations();
  });

  it("builds canonical and hreflang alternates for the about page", () => {
    const tags = meta(metaArgs("/es/sobre-mi"));

    expect(tags).toContainEqual({ title: "Sobre mí — Aquiles Cancinos" });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "/es/sobre-mi",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: "/en/about",
    });
  });
});
