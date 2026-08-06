import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { LearningEntry } from "@content";

import { LearningArchive } from "./learning-archive";

const entries: LearningEntry[] = [
  {
    kind: "course",
    slug: "advanced-react-patterns",
    name: "Advanced React patterns",
    provider: "Frontend Masters",
    category: "frontend",
    startDate: "2025-01",
    endDate: "2025-02",
    status: "completed",
    relevance: 2,
    featured: false,
    skills: [{ slug: "rest-api-design", name: "REST API design" }],
  },
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
];

function renderArchive(initialEntry: string, data: LearningEntry[] = entries) {
  const Stub = createRoutesStub([
    {
      path: "/es/formacion",
      Component: () => <LearningArchive entries={data} locale="es" />,
    },
  ]);
  return render(<Stub initialEntries={[initialEntry]} />);
}

describe("LearningArchive", () => {
  it("renders every entry when no filter or search is active", () => {
    renderArchive("/es/formacion");

    expect(screen.getByText("Advanced React patterns")).toBeInTheDocument();
    expect(screen.getByText("AWS Cloud Practitioner")).toBeInTheDocument();
  });

  it("narrows the list to entries matching the URL's category filter", () => {
    renderArchive("/es/formacion?category=cloud");

    expect(screen.getByText("AWS Cloud Practitioner")).toBeInTheDocument();
    expect(
      screen.queryByText("Advanced React patterns"),
    ).not.toBeInTheDocument();
  });

  it("marks the active kind filter with aria-current", () => {
    renderArchive("/es/formacion?kind=certification");

    expect(screen.getByRole("link", { name: "Certificación" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("shows the empty state when no entry matches the filter", () => {
    renderArchive("/es/formacion?category=does-not-exist");

    expect(
      screen.getByText(
        "Ningún curso ni certificación coincide con estos filtros.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the empty state when the archive has no entries yet", () => {
    renderArchive("/es/formacion", []);

    expect(
      screen.getByText(
        "Ningún curso ni certificación coincide con estos filtros.",
      ),
    ).toBeInTheDocument();
  });

  it("lazily loads the search module and narrows results as the user types", async () => {
    const user = userEvent.setup();
    renderArchive("/es/formacion");

    const input = screen.getByLabelText("Buscar en el archivo");
    await user.type(input, "aws");

    await waitFor(() => {
      expect(
        screen.queryByText("Advanced React patterns"),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText("AWS Cloud Practitioner")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderArchive("/es/formacion");
    expect(await axe(container)).toHaveNoViolations();
  });
});
