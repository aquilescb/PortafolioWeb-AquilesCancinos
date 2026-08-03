import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { ProjectSummary } from "@content";

import Projects, { meta } from "./projects";

const projects: ProjectSummary[] = [
  {
    slug: "inventory-system",
    title: "Inventory System",
    summary: "Project A.",
    year: 2025,
    tier: "featured",
    context: "professional",
    categories: ["web"],
    visibility: "public",
    cover: "/a.jpg",
    technologies: [
      { slug: "react", name: "React", category: "framework", level: "core" },
    ],
  },
  {
    slug: "budget-tracker",
    title: "Budget Tracker",
    summary: "Project B.",
    year: 2024,
    tier: "main",
    context: "personal",
    categories: ["mobile"],
    visibility: "public",
    cover: "/b.jpg",
    technologies: [
      { slug: "vue", name: "Vue", category: "framework", level: "working" },
    ],
  },
];

function metaArgs(pathname: string) {
  return {
    location: { pathname },
    params: {},
    matches: [],
    loaderData: undefined,
  } as unknown as Parameters<typeof meta>[0];
}

function renderProjects(
  initialEntry: string,
  data: ProjectSummary[] = projects,
) {
  const Stub = createRoutesStub([
    {
      path: "/es/proyectos",
      Component: Projects,
      loader: () => ({ projects: data }),
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("Projects route", () => {
  it("renders a single top-level heading and every loaded project", async () => {
    renderProjects("/es/proyectos");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Proyectos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Inventory System" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Budget Tracker" }),
    ).toBeInTheDocument();
  });

  it("narrows the list to projects matching the URL's filter", async () => {
    renderProjects("/es/proyectos?year=2024");

    expect(
      await screen.findByRole("link", { name: "Budget Tracker" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Inventory System" }),
    ).not.toBeInTheDocument();
  });

  it("shows the empty state when no project matches the filter", async () => {
    renderProjects("/es/proyectos?year=1999");

    expect(
      await screen.findByText(
        "Todavía no hay proyectos cargados con estos filtros.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the empty state when the content layer has no projects yet", async () => {
    renderProjects("/es/proyectos", []);

    expect(
      await screen.findByText(
        "Todavía no hay proyectos cargados con estos filtros.",
      ),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderProjects("/es/proyectos");
    await screen.findByRole("heading", { level: 1 });

    expect(await axe(container)).toHaveNoViolations();
  });

  it("builds canonical and hreflang alternates for the projects page", () => {
    const tags = meta(metaArgs("/es/proyectos"));

    expect(tags).toContainEqual({ title: "Proyectos — Aquiles Cancinos" });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "/es/proyectos",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: "/en/projects",
    });
  });
});
