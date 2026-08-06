import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { LearningEntry } from "@content";

import { LearningEntryCard } from "./learning-entry-card";

const course: LearningEntry = {
  kind: "course",
  slug: "advanced-react-patterns",
  name: "Advanced React patterns",
  provider: "Frontend Masters",
  category: "frontend",
  startDate: "2025-01",
  endDate: "2025-02",
  status: "completed",
  hours: 12,
  relevance: 2,
  featured: false,
  verificationUrl: "https://example.com/verify",
  skills: [{ slug: "rest-api-design", name: "REST API design" }],
};

const ongoingCourse: LearningEntry = {
  ...course,
  slug: "ongoing-course",
  name: "Ongoing course",
  endDate: undefined,
  status: "in-progress",
  hours: undefined,
  skills: [],
};

const certification: LearningEntry = {
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
  expiresAt: "2028-03-20",
  issuer: "Amazon Web Services",
  skills: [],
};

function renderCard(entry: LearningEntry) {
  return render(
    <MemoryRouter>
      <LearningEntryCard entry={entry} />
    </MemoryRouter>,
  );
}

describe("LearningEntryCard", () => {
  it("renders a course's name, provider, category and date range", () => {
    renderCard(course);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Advanced React patterns",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend Masters · frontend")).toBeInTheDocument();
    expect(screen.getByText("2025-01 – 2025-02")).toBeInTheDocument();
  });

  it("renders a course's verification link", () => {
    renderCard(course);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/verify",
    );
  });

  it("marks an in-progress entry without an endDate", () => {
    renderCard(ongoingCourse);

    expect(screen.getByText("2025-01")).toBeInTheDocument();
    expect(screen.getByText("En curso")).toBeInTheDocument();
  });

  it("renders a certification's issuedAt, expiresAt and issuer", () => {
    renderCard(certification);

    expect(screen.getByText("2025-03-20")).toBeInTheDocument();
    expect(screen.getByText("2028-03-20")).toBeInTheDocument();
    expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderCard(course);
    expect(await axe(container)).toHaveNoViolations();
  });
});
