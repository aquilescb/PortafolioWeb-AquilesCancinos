import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { ProjectSummary } from "@content";

import { ProjectFilters } from "./project-filters";

const projects: ProjectSummary[] = [
  {
    slug: "a",
    title: "A",
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
    slug: "b",
    title: "B",
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

function renderFilters(initialEntry: string) {
  const Stub = createRoutesStub([
    {
      path: "/es/proyectos",
      Component: () => <ProjectFilters projects={projects} locale="es" />,
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("ProjectFilters", () => {
  it("renders nothing when the project list has no filterable values", () => {
    const Stub = createRoutesStub([
      {
        path: "/es/proyectos",
        Component: () => <ProjectFilters projects={[]} locale="es" />,
      },
    ]);
    const { container } = render(<Stub initialEntries={["/es/proyectos"]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("marks the active technology filter with aria-current", () => {
    renderFilters("/es/proyectos?tech=react");

    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "Vue" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("links to the URL that turns the clicked filter on", () => {
    renderFilters("/es/proyectos");

    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "/es/proyectos?tech=react",
    );
  });

  it("links back to the base path when a filter is already active", () => {
    renderFilters("/es/proyectos?tech=react");

    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "/es/proyectos",
    );
  });

  it("shows a clear-filters link only once a filter is active", () => {
    renderFilters("/es/proyectos");
    expect(
      screen.queryByRole("link", { name: "Limpiar filtros" }),
    ).not.toBeInTheDocument();

    renderFilters("/es/proyectos?tech=react");
    expect(
      screen.getByRole("link", { name: "Limpiar filtros" }),
    ).toHaveAttribute("href", "/es/proyectos");
  });

  it("updates the active filter after a click", async () => {
    const user = userEvent.setup();
    renderFilters("/es/proyectos");

    await user.click(screen.getByRole("link", { name: "React" }));

    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderFilters("/es/proyectos?tech=react");

    expect(await axe(container)).toHaveNoViolations();
  });
});
