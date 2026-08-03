import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { ProjectSummary } from "@content";

import { ProjectCard } from "./project-card";

const project: ProjectSummary = {
  slug: "inventory-system",
  title: "Inventory System",
  summary: "A system that tracks inventory across warehouses.",
  year: 2025,
  tier: "featured",
  context: "professional",
  categories: ["web"],
  visibility: "public",
  cover: "/images/inventory-system/cover.jpg",
  technologies: [
    { slug: "react", name: "React", category: "framework", level: "core" },
  ],
};

describe("ProjectCard", () => {
  it("links the title to the localized project detail page", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} locale="es" />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "Inventory System" }),
    ).toHaveAttribute("href", "/es/proyectos/inventory-system");
  });

  it("uses the English projects segment for the English locale", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} locale="en" />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "Inventory System" }),
    ).toHaveAttribute("href", "/en/projects/inventory-system");
  });

  it("lists the project's technologies", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} locale="es" />
      </MemoryRouter>,
    );

    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={project} locale="es" />
      </MemoryRouter>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
