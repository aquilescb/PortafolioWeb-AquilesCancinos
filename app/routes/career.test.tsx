import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { CareerEntry } from "@content";

import Career, { meta } from "./career";

const timeline: CareerEntry[] = [
  {
    type: "milestone",
    slug: "salta-lab-winner",
    title: "Salta Lab winner",
    startDate: "2025-11-15",
    hasOwnPage: true,
  },
  {
    type: "experience",
    slug: "acme-backend-intern",
    title: "Backend intern",
    organization: "Acme",
    startDate: "2024-01",
    endDate: "2024-06",
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

function renderCareer(initialEntry: string, data: CareerEntry[] = timeline) {
  const Stub = createRoutesStub([
    {
      path: "/es/trayectoria",
      Component: Career,
      loader: () => ({ timeline: data }),
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("Career route", () => {
  it("renders a single top-level heading and every loaded entry", async () => {
    renderCareer("/es/trayectoria");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Trayectoria" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Salta Lab winner" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Backend intern")).toBeInTheDocument();
  });

  it("narrows the list to entries matching the URL's type filter", async () => {
    renderCareer("/es/trayectoria?type=milestone");

    expect(
      await screen.findByRole("link", { name: "Salta Lab winner" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Backend intern")).not.toBeInTheDocument();
  });

  it("shows the empty state when no entry matches the filter", async () => {
    renderCareer("/es/trayectoria?type=education");

    expect(
      await screen.findByText(
        "Todavía no hay entradas cargadas con este filtro.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the empty state when the content layer has no entries yet", async () => {
    renderCareer("/es/trayectoria", []);

    expect(
      await screen.findByText(
        "Todavía no hay entradas cargadas con este filtro.",
      ),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderCareer("/es/trayectoria");
    await screen.findByRole("heading", { level: 1 });

    expect(await axe(container)).toHaveNoViolations();
  });

  it("builds canonical and hreflang alternates for the career page", () => {
    const tags = meta(metaArgs("/es/trayectoria"));

    expect(tags).toContainEqual({ title: "Trayectoria — Aquiles Cancinos" });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "canonical",
      href: "/es/trayectoria",
    });
    expect(tags).toContainEqual({
      tagName: "link",
      rel: "alternate",
      hrefLang: "en",
      href: "/en/career",
    });
  });
});
