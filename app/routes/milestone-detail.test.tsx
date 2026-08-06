import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import type {
  CaseStudyResult,
  MilestoneDetail as MilestoneDetailData,
} from "@content";

vi.mock("@content", () => ({
  getMilestoneBySlug: vi.fn(),
  getMilestoneBody: vi.fn(),
}));

import { getMilestoneBody, getMilestoneBySlug } from "@content";
import MilestoneDetail, { loader, meta } from "./milestone-detail";

const milestone: MilestoneDetailData = {
  slug: "salta-lab-winner",
  title: "Salta Lab winner",
  type: "contest",
  date: "2025-11-15",
  organization: "Salta Lab",
  summary: "Won first place at the Salta Lab contest.",
  evidence: [
    {
      url: "https://example.com/press",
      label: "Press coverage",
      kind: "press",
    },
  ],
  relatedProjects: [
    {
      slug: "inventory-system",
      title: "Inventory System",
      summary: "Tracks inventory across warehouses.",
      year: 2025,
      tier: "main",
      context: "professional",
      categories: ["web"],
      visibility: "public",
      cover: "/cover.jpg",
      technologies: [],
    },
  ],
  hasBody: true,
};

function MilestoneBody() {
  return <p>Milestone body.</p>;
}

function renderDetail(
  data: MilestoneDetailData = milestone,
  body: CaseStudyResult | null = null,
) {
  const Stub = createRoutesStub([
    {
      path: "/es/hitos/:slug",
      Component: MilestoneDetail,
      loader: () => ({ milestone: data, body }),
    },
  ]);
  return render(<Stub initialEntries={[`/es/hitos/${data.slug}`]} />);
}

describe("MilestoneDetail route component", () => {
  it("renders a single top-level heading with the milestone title", async () => {
    renderDetail();

    const headings = await screen.findAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Salta Lab winner");
  });

  it("links back to the localized career page", async () => {
    renderDetail();

    expect(
      await screen.findByRole("link", { name: "Volver a trayectoria" }),
    ).toHaveAttribute("href", "/es/trayectoria");
  });

  it("lists the milestone's evidence links", async () => {
    renderDetail();

    expect(
      await screen.findByRole("link", { name: /Press coverage/ }),
    ).toHaveAttribute("href", "https://example.com/press");
  });

  it("links to related projects", async () => {
    renderDetail();

    expect(
      await screen.findByRole("link", { name: "Inventory System" }),
    ).toHaveAttribute("href", "/es/proyectos/inventory-system");
  });

  it("renders the milestone body prose when present", async () => {
    renderDetail(milestone, {
      Component: MilestoneBody,
      locale: "es",
      isFallback: false,
    });

    expect(await screen.findByText("Milestone body.")).toBeInTheDocument();
    expect(
      screen.queryByText(/todavía no está traducido/),
    ).not.toBeInTheDocument();
  });

  it("shows the not-translated notice when the body is a fallback", async () => {
    renderDetail(milestone, {
      Component: MilestoneBody,
      locale: "en",
      isFallback: true,
    });

    expect(
      await screen.findByText(/todavía no está traducido/),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderDetail(milestone, {
      Component: MilestoneBody,
      locale: "es",
      isFallback: false,
    });
    await screen.findAllByRole("heading", { level: 1 });

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("milestone-detail loader", () => {
  it("throws a 404 response for an unknown slug", async () => {
    vi.mocked(getMilestoneBySlug).mockReturnValue(null);

    await expect(
      loader({
        request: new Request("http://localhost/es/hitos/does-not-exist"),
        params: { slug: "does-not-exist" },
      } as unknown as Parameters<typeof loader>[0]),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("loads the milestone and its body for a known slug", async () => {
    vi.mocked(getMilestoneBySlug).mockReturnValue(milestone);
    vi.mocked(getMilestoneBody).mockResolvedValue({
      Component: MilestoneBody,
      locale: "es",
      isFallback: false,
    });

    const result = await loader({
      request: new Request("http://localhost/es/hitos/salta-lab-winner"),
      params: { slug: "salta-lab-winner" },
    } as unknown as Parameters<typeof loader>[0]);

    expect(result.milestone.slug).toBe("salta-lab-winner");
    expect(getMilestoneBySlug).toHaveBeenCalledWith("salta-lab-winner", "es");
    expect(getMilestoneBody).toHaveBeenCalledWith("salta-lab-winner", "es");
  });
});

describe("milestone-detail meta", () => {
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

  it("builds canonical and hreflang alternates for the milestone's own slug", () => {
    const tags = meta(
      metaArgs("/es/hitos/salta-lab-winner", { milestone, body: null }),
    );

    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "https://portafolio-web-aquiles-cancinos.vercel.app/es/hitos/salta-lab-winner",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: "https://portafolio-web-aquiles-cancinos.vercel.app/en/milestones/salta-lab-winner",
    });
  });

  it("renders Event and BreadcrumbList JSON-LD for the milestone", () => {
    const tags = meta(
      metaArgs("/es/hitos/salta-lab-winner", { milestone, body: null }),
    );

    expect(tags).toContainEqual({
      "script:ld+json": expect.objectContaining({
        "@type": "Event",
        name: "Salta Lab winner",
        url: "https://portafolio-web-aquiles-cancinos.vercel.app/es/hitos/salta-lab-winner",
      }),
    });
    expect(tags).toContainEqual({
      "script:ld+json": expect.objectContaining({
        "@type": "BreadcrumbList",
      }),
    });
  });

  it("does not mark a fully translated body noindex", () => {
    const tags = meta(
      metaArgs("/es/hitos/salta-lab-winner", {
        milestone,
        body: { Component: MilestoneBody, locale: "es", isFallback: false },
      }),
    );

    expect(tags).not.toContainEqual({ name: "robots", content: "noindex" });
  });

  it("marks a fallback body noindex", () => {
    const tags = meta(
      metaArgs("/es/hitos/salta-lab-winner", {
        milestone,
        body: { Component: MilestoneBody, locale: "en", isFallback: true },
      }),
    );

    expect(tags).toContainEqual({ name: "robots", content: "noindex" });
  });

  it("falls back to the not-found title when there's no loader data", () => {
    const tags = meta(metaArgs("/es/hitos/does-not-exist", undefined));

    expect(tags).toContainEqual({
      title: "Página no encontrada — Aquiles Cancinos",
    });
    expect(tags).toContainEqual({ name: "robots", content: "noindex" });
  });
});
