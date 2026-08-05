import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { CareerEntry } from "@content";

import { TimelineEntry } from "./timeline-entry";

const experienceEntry: CareerEntry = {
  type: "experience",
  slug: "acme-backend-intern",
  title: "Backend intern",
  organization: "Acme",
  startDate: "2024-01",
  endDate: "2024-06",
};

const ongoingEntry: CareerEntry = {
  type: "experience",
  slug: "ongoing-freelance",
  title: "Freelance developer",
  startDate: "2025-01",
};

const milestoneWithPage: CareerEntry = {
  type: "milestone",
  slug: "salta-lab-winner",
  title: "Salta Lab winner",
  startDate: "2025-11-15",
  hasOwnPage: true,
};

describe("TimelineEntry", () => {
  it("renders a closed date range", () => {
    render(
      <MemoryRouter>
        <TimelineEntry entry={experienceEntry} locale="es" />
      </MemoryRouter>,
    );

    expect(screen.getByText("2024-01 – 2024-06")).toBeInTheDocument();
  });

  it("renders an open date range as ongoing", () => {
    render(
      <MemoryRouter>
        <TimelineEntry entry={ongoingEntry} locale="es" />
      </MemoryRouter>,
    );

    expect(screen.getByText("2025-01 – Presente")).toBeInTheDocument();
  });

  it("renders a milestone's single date without a range", () => {
    render(
      <MemoryRouter>
        <TimelineEntry entry={milestoneWithPage} locale="es" />
      </MemoryRouter>,
    );

    expect(screen.getByText("2025-11-15")).toBeInTheDocument();
  });

  it("links the title to the milestone detail page when hasOwnPage is true", () => {
    render(
      <MemoryRouter>
        <TimelineEntry entry={milestoneWithPage} locale="es" />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "Salta Lab winner" }),
    ).toHaveAttribute("href", "/es/hitos/salta-lab-winner");
  });

  it("renders a plain title when the entry has no own page", () => {
    render(
      <MemoryRouter>
        <TimelineEntry entry={experienceEntry} locale="es" />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Backend intern")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <TimelineEntry entry={milestoneWithPage} locale="es" />
      </MemoryRouter>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
