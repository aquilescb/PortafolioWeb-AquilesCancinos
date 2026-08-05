import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { CareerEntry } from "@content";

import { TimelineFilters } from "./timeline-filters";

const entries: CareerEntry[] = [
  {
    type: "experience",
    slug: "acme-backend-intern",
    title: "Backend intern",
    startDate: "2024-01",
    endDate: "2024-06",
  },
  {
    type: "milestone",
    slug: "salta-lab-winner",
    title: "Salta Lab winner",
    startDate: "2025-11-15",
  },
];

function renderFilters(initialEntry: string) {
  const Stub = createRoutesStub([
    {
      path: "/es/trayectoria",
      Component: () => <TimelineFilters entries={entries} locale="es" />,
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("TimelineFilters", () => {
  it("renders nothing when the timeline has no entries", () => {
    const Stub = createRoutesStub([
      {
        path: "/es/trayectoria",
        Component: () => <TimelineFilters entries={[]} locale="es" />,
      },
    ]);
    const { container } = render(<Stub initialEntries={["/es/trayectoria"]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("marks the active type filter with aria-current", () => {
    renderFilters("/es/trayectoria?type=milestone");

    expect(screen.getByRole("link", { name: "Hito" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "Experiencia" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("links to the URL that turns the clicked filter on", () => {
    renderFilters("/es/trayectoria");

    expect(screen.getByRole("link", { name: "Hito" })).toHaveAttribute(
      "href",
      "/es/trayectoria?type=milestone",
    );
  });

  it("links back to the base path when a filter is already active", () => {
    renderFilters("/es/trayectoria?type=milestone");

    expect(screen.getByRole("link", { name: "Hito" })).toHaveAttribute(
      "href",
      "/es/trayectoria",
    );
  });

  it("shows a clear-filter link only once a filter is active", () => {
    renderFilters("/es/trayectoria");
    expect(
      screen.queryByRole("link", { name: "Limpiar filtro" }),
    ).not.toBeInTheDocument();

    renderFilters("/es/trayectoria?type=milestone");
    expect(
      screen.getByRole("link", { name: "Limpiar filtro" }),
    ).toHaveAttribute("href", "/es/trayectoria");
  });

  it("updates the active filter after a click", async () => {
    const user = userEvent.setup();
    renderFilters("/es/trayectoria");

    await user.click(screen.getByRole("link", { name: "Hito" }));

    expect(screen.getByRole("link", { name: "Hito" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderFilters("/es/trayectoria?type=milestone");

    expect(await axe(container)).toHaveNoViolations();
  });
});
