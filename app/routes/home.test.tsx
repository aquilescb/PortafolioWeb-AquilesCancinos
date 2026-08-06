import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { ContactInfo, ProjectSummary } from "@content";

import Home, { meta } from "./home";

const contact: ContactInfo = {
  emailUser: "aquiles",
  emailDomain: "example.com",
  socials: [
    { url: "https://github.com/example", label: "GitHub", kind: "profile" },
  ],
};

const featuredProject: ProjectSummary = {
  slug: "inventory-system",
  title: "Inventory System",
  summary: "Tracks inventory across warehouses.",
  year: 2025,
  tier: "featured",
  context: "professional",
  categories: ["web"],
  visibility: "public",
  cover: "/cover.jpg",
  technologies: [
    { slug: "react", name: "React", category: "framework", level: "core" },
  ],
};

function metaArgs(pathname: string, matches: unknown[] = []) {
  return {
    location: { pathname },
    params: {},
    matches,
    loaderData: undefined,
  } as unknown as Parameters<typeof meta>[0];
}

function renderHome(
  initialEntry: string,
  featured: ProjectSummary[] = [],
  data: ContactInfo = contact,
) {
  const Stub = createRoutesStub([
    {
      path: "/es",
      Component: Home,
      loader: () => ({ featured, contact: data }),
    },
    {
      path: "/en",
      Component: Home,
      loader: () => ({ featured, contact: data }),
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("Home route", () => {
  it("renders a single top-level heading with the site name", async () => {
    renderHome("/es");

    const headings = await screen.findAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Aquiles Cancinos");
  });

  it("renders the Spanish role and value proposition at /es", async () => {
    renderHome("/es");

    expect(
      await screen.findByText("Desarrollador Full-Stack"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/diseño y construyo sistemas completos/i),
    ).toBeInTheDocument();
  });

  it("renders the English role and value proposition at /en", async () => {
    renderHome("/en");

    expect(await screen.findByText("Full-Stack Developer")).toBeInTheDocument();
    expect(
      screen.getByText(/i design and build complete systems/i),
    ).toBeInTheDocument();
  });

  it("links the CTAs to the projects and about pages", async () => {
    renderHome("/es");

    expect(
      await screen.findByRole("link", { name: "Ver proyectos" }),
    ).toHaveAttribute("href", "/es/proyectos");
    expect(screen.getByRole("link", { name: "Sobre mí" })).toHaveAttribute(
      "href",
      "/es/sobre-mi",
    );
  });

  it("shows the featured-projects empty state when there are none yet", async () => {
    renderHome("/es", []);

    expect(
      await screen.findByText("Todavía no hay proyectos destacados cargados."),
    ).toBeInTheDocument();
  });

  it("renders up to three featured projects when present", async () => {
    renderHome("/es", [featuredProject]);

    expect(
      await screen.findByRole("heading", {
        level: 3,
        name: "Inventory System",
      }),
    ).toBeInTheDocument();
  });

  it("derives the evidence stack from the featured projects shown", async () => {
    renderHome("/es", [featuredProject]);

    // "React" appears twice: once in the featured project's own tag list,
    // once in the evidence section derived from it.
    expect(await screen.findAllByText("React")).toHaveLength(2);
  });

  it("shows the evidence empty state when there are no featured projects", async () => {
    renderHome("/es", []);

    expect(
      await screen.findByText("Todavía no hay tecnologías para mostrar."),
    ).toBeInTheDocument();
  });

  it("links to the contact's social profiles", async () => {
    renderHome("/es");

    expect(
      await screen.findByRole("link", { name: /^GitHub/ }),
    ).toHaveAttribute("href", "https://github.com/example");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderHome("/es", [featuredProject]);
    await screen.findAllByRole("heading", { level: 1 });

    expect(await axe(container)).toHaveNoViolations();
  });

  it("builds canonical and hreflang alternates for the home page", () => {
    const tags = meta(metaArgs("/es"));

    expect(tags).toContainEqual({
      title:
        "Aquiles Cancinos — Desarrollador Full-Stack | Sistemas web completos",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "https://portafolio-web-aquiles-cancinos.vercel.app/es",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: "https://portafolio-web-aquiles-cancinos.vercel.app/en",
    });
  });

  it("pulls the root route's global JSON-LD tags back in", () => {
    const rootTags = [{ "script:ld+json": { "@type": "Person" } }];
    const tags = meta(
      metaArgs("/es", [{ id: "root", meta: rootTags }, { id: "home-es" }]),
    );

    expect(tags).toContainEqual(rootTags[0]);
  });
});
