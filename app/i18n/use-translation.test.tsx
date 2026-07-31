import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { useTranslation } from "./use-translation";

function Probe() {
  const t = useTranslation();
  return <p>{t.nav.skipToContent}</p>;
}

describe("useTranslation", () => {
  it("resolves the Spanish dictionary at an /es path", () => {
    render(
      <MemoryRouter initialEntries={["/es/anything"]}>
        <Probe />
      </MemoryRouter>,
    );

    expect(screen.getByText("Saltar al contenido")).toBeInTheDocument();
  });

  it("resolves the English dictionary at an /en path", () => {
    render(
      <MemoryRouter initialEntries={["/en/anything"]}>
        <Probe />
      </MemoryRouter>,
    );

    expect(screen.getByText("Skip to content")).toBeInTheDocument();
  });

  it("falls back to the default locale when no locale segment is present", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Probe />
      </MemoryRouter>,
    );

    expect(screen.getByText("Saltar al contenido")).toBeInTheDocument();
  });
});
