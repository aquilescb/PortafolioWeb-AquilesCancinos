import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Header } from "./header";

describe("Header", () => {
  it("links the wordmark to the locale-aware home route", () => {
    const Stub = createRoutesStub([{ path: "/es", Component: Header }]);
    render(<Stub initialEntries={["/es"]} />);

    expect(
      screen.getByRole("link", { name: "Aquiles Cancinos" }),
    ).toHaveAttribute("href", "/es");
  });

  it("links to the localized projects page", () => {
    const Stub = createRoutesStub([{ path: "/es", Component: Header }]);
    render(<Stub initialEntries={["/es"]} />);

    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "href",
      "/es/proyectos",
    );
  });

  it("links to the localized career page", () => {
    const Stub = createRoutesStub([{ path: "/es", Component: Header }]);
    render(<Stub initialEntries={["/es"]} />);

    expect(screen.getByRole("link", { name: "Trayectoria" })).toHaveAttribute(
      "href",
      "/es/trayectoria",
    );
  });

  it("links to the localized learning page", () => {
    const Stub = createRoutesStub([{ path: "/es", Component: Header }]);
    render(<Stub initialEntries={["/es"]} />);

    expect(screen.getByRole("link", { name: "Formación" })).toHaveAttribute(
      "href",
      "/es/formacion",
    );
  });

  it("links to the localized about page", () => {
    const Stub = createRoutesStub([{ path: "/es", Component: Header }]);
    render(<Stub initialEntries={["/es"]} />);

    expect(screen.getByRole("link", { name: "Sobre mí" })).toHaveAttribute(
      "href",
      "/es/sobre-mi",
    );
  });

  it("includes a language switcher linking to the other locale", () => {
    const Stub = createRoutesStub([{ path: "/es", Component: Header }]);
    render(<Stub initialEntries={["/es"]} />);

    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const Stub = createRoutesStub([{ path: "/es", Component: Header }]);
    const { container } = render(<Stub initialEntries={["/es"]} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
