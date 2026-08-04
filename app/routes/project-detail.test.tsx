import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import type {
  CaseStudyResult,
  ProjectDetail as ProjectDetailData,
} from "@content";

vi.mock("@content", () => ({
  getProjectBySlug: vi.fn(),
  getCaseStudy: vi.fn(),
}));

import { getCaseStudy, getProjectBySlug } from "@content";
import ProjectDetail, { loader, meta } from "./project-detail";

const project: ProjectDetailData = {
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
  problem: "Manual tracking caused stock errors.",
  role: "Full-stack developer",
  duration: "3 months",
  organization: "Acme",
  teamSize: 2,
  status: "completed",
  repositoryUrl: "https://github.com/example/inventory-system",
  demoUrl: "https://inventory.example.com",
  screenshots: ["/shot-1.jpg", "/shot-2.jpg"],
  hasCaseStudy: true,
};

function CaseStudyBody() {
  return <p>Case study body.</p>;
}

function renderDetail(
  data: ProjectDetailData = project,
  caseStudy: CaseStudyResult | null = null,
) {
  const Stub = createRoutesStub([
    {
      path: "/es/proyectos/:slug",
      Component: ProjectDetail,
      loader: () => ({ project: data, caseStudy }),
    },
  ]);
  return render(<Stub initialEntries={[`/es/proyectos/${data.slug}`]} />);
}

describe("ProjectDetail route component", () => {
  it("renders a single top-level heading with the project title", async () => {
    renderDetail();

    const headings = await screen.findAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Inventory System");
  });

  it("links back to the localized projects list", async () => {
    renderDetail();

    expect(
      await screen.findByRole("link", { name: "Volver a proyectos" }),
    ).toHaveAttribute("href", "/es/proyectos");
  });

  it("lists the project's technologies", async () => {
    renderDetail();

    expect(await screen.findByText("React")).toBeInTheDocument();
  });

  it("links to the repository and demo for a public project", async () => {
    renderDetail();

    expect(
      await screen.findByRole("link", { name: /repositorio/i }),
    ).toHaveAttribute("href", project.repositoryUrl);
    expect(screen.getByRole("link", { name: /demo/i })).toHaveAttribute(
      "href",
      project.demoUrl,
    );
  });

  it("shows a private-repository notice instead of a link when private", async () => {
    renderDetail({
      ...project,
      visibility: "private",
      repositoryUrl: undefined,
    });

    expect(await screen.findByText("Repositorio privado")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /repositorio/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the case study prose when present", async () => {
    renderDetail(project, {
      Component: CaseStudyBody,
      locale: "es",
      isFallback: false,
    });

    expect(await screen.findByText("Case study body.")).toBeInTheDocument();
    expect(
      screen.queryByText(/todavía no está traducido/),
    ).not.toBeInTheDocument();
  });

  it("shows the not-translated notice when the case study is a fallback", async () => {
    renderDetail(project, {
      Component: CaseStudyBody,
      locale: "en",
      isFallback: true,
    });

    expect(
      await screen.findByText(/todavía no está traducido/),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderDetail(project, {
      Component: CaseStudyBody,
      locale: "es",
      isFallback: false,
    });
    await screen.findAllByRole("heading", { level: 1 });

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("project-detail loader", () => {
  it("throws a 404 response for an unknown slug", async () => {
    vi.mocked(getProjectBySlug).mockReturnValue(null);

    await expect(
      loader({
        request: new Request("http://localhost/es/proyectos/does-not-exist"),
        params: { slug: "does-not-exist" },
      } as unknown as Parameters<typeof loader>[0]),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("loads the project and its case study for a known slug", async () => {
    vi.mocked(getProjectBySlug).mockReturnValue(project);
    vi.mocked(getCaseStudy).mockResolvedValue({
      Component: CaseStudyBody,
      locale: "es",
      isFallback: false,
    });

    const result = await loader({
      request: new Request("http://localhost/es/proyectos/inventory-system"),
      params: { slug: "inventory-system" },
    } as unknown as Parameters<typeof loader>[0]);

    expect(result.project.slug).toBe("inventory-system");
    expect(getProjectBySlug).toHaveBeenCalledWith("inventory-system", "es");
    expect(getCaseStudy).toHaveBeenCalledWith("inventory-system", "es");
  });
});

describe("project-detail meta", () => {
  function metaArgs(
    pathname: string,
    loaderData?: Awaited<ReturnType<typeof loader>>,
  ) {
    return {
      location: { pathname },
      params: {},
      matches: [],
      loaderData,
    } as unknown as Parameters<typeof meta>[0];
  }

  it("builds canonical and hreflang alternates for the project's own slug", () => {
    const tags = meta(
      metaArgs("/es/proyectos/inventory-system", { project, caseStudy: null }),
    );

    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "/es/proyectos/inventory-system",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: "/en/projects/inventory-system",
    });
  });

  it("renders CreativeWork and BreadcrumbList JSON-LD for the project", () => {
    const tags = meta(
      metaArgs("/es/proyectos/inventory-system", { project, caseStudy: null }),
    );

    expect(tags).toContainEqual({
      "script:ld+json": expect.objectContaining({
        "@type": "CreativeWork",
        name: "Inventory System",
        url: "https://portafolio-web-aquiles-cancinos.vercel.app/es/proyectos/inventory-system",
      }),
    });
    expect(tags).toContainEqual({
      "script:ld+json": expect.objectContaining({
        "@type": "BreadcrumbList",
      }),
    });
  });

  it("does not mark a fully translated case study noindex", () => {
    const tags = meta(
      metaArgs("/es/proyectos/inventory-system", {
        project,
        caseStudy: {
          Component: CaseStudyBody,
          locale: "es",
          isFallback: false,
        },
      }),
    );

    expect(tags).not.toContainEqual({ name: "robots", content: "noindex" });
  });

  it("marks a fallback case study noindex", () => {
    const tags = meta(
      metaArgs("/es/proyectos/inventory-system", {
        project,
        caseStudy: { Component: CaseStudyBody, locale: "en", isFallback: true },
      }),
    );

    expect(tags).toContainEqual({ name: "robots", content: "noindex" });
  });

  it("falls back to the not-found title when there's no loader data", () => {
    const tags = meta(metaArgs("/es/proyectos/does-not-exist", undefined));

    expect(tags).toContainEqual({
      title: "Página no encontrada — Aquiles Cancinos",
    });
    expect(tags).toContainEqual({ name: "robots", content: "noindex" });
  });
});
