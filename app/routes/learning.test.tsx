import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { LearningEntry } from "@content";

import Learning, { meta } from "./learning";

const entries: LearningEntry[] = [
  {
    kind: "certification",
    slug: "aws-cloud-practitioner",
    name: "AWS Cloud Practitioner",
    provider: "AWS",
    category: "cloud",
    startDate: "2025-03",
    status: "completed",
    relevance: 3,
    featured: true,
    issuedAt: "2025-03-20",
    issuer: "Amazon Web Services",
    skills: [],
  },
  {
    kind: "course",
    slug: "advanced-react-patterns",
    name: "Advanced React patterns",
    provider: "Frontend Masters",
    category: "frontend",
    startDate: "2025-01",
    endDate: "2025-02",
    status: "completed",
    relevance: 1,
    featured: false,
    skills: [],
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

function renderLearning(initialEntry: string, data: LearningEntry[] = entries) {
  const Stub = createRoutesStub([
    {
      path: "/es/formacion",
      Component: Learning,
      loader: () => ({ entries: data }),
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("Learning route", () => {
  it("renders a single top-level heading and the four sections", async () => {
    renderLearning("/es/formacion");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Formación" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Destacados" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Certificaciones profesionales",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Formación complementaria",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Archivo completo" }),
    ).toBeInTheDocument();
  });

  it("shows the featured certification with a full card", async () => {
    renderLearning("/es/formacion");

    expect(
      await screen.findAllByText("AWS Cloud Practitioner"),
    ).not.toHaveLength(0);
  });

  it("lists certifications compactly with their issuer and date", async () => {
    renderLearning("/es/formacion");
    const heading = await screen.findByRole("heading", {
      level: 2,
      name: "Certificaciones profesionales",
    });
    const section = heading.closest("section");

    expect(section).not.toBeNull();
    expect(
      section &&
        Array.from(section.querySelectorAll("li")).some((item) =>
          item.textContent?.includes("Amazon Web Services"),
        ),
    ).toBe(true);
  });

  it("groups complementary courses by category as a collapsed disclosure", async () => {
    renderLearning("/es/formacion");
    await screen.findByRole("heading", { level: 1 });

    const disclosure = screen.getByText("frontend (1)").closest("details");
    expect(disclosure).not.toHaveAttribute("open");
  });

  it("shows empty states in every section when there is no content yet", async () => {
    renderLearning("/es/formacion", []);
    await screen.findByRole("heading", { level: 1 });

    expect(
      screen.getByText("Todavía no hay formación destacada cargada."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Todavía no hay certificaciones cargadas."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Todavía no hay formación complementaria cargada."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ningún curso ni certificación coincide con estos filtros.",
      ),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderLearning("/es/formacion");
    await screen.findByRole("heading", { level: 1 });

    expect(await axe(container)).toHaveNoViolations();
  });

  it("builds canonical and hreflang alternates for the learning page", () => {
    const tags = meta(metaArgs("/es/formacion"));

    expect(tags).toContainEqual({ title: "Formación — Aquiles Cancinos" });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "https://portafolio-web-aquiles-cancinos.vercel.app/es/formacion",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: "https://portafolio-web-aquiles-cancinos.vercel.app/en/learning",
    });
  });
});
