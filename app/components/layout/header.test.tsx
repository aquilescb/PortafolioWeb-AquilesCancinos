import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Header } from "./header";

describe("Header", () => {
  it("links the wordmark to the home route", () => {
    const Stub = createRoutesStub([{ path: "/", Component: Header }]);
    render(<Stub initialEntries={["/"]} />);

    expect(
      screen.getByRole("link", { name: "Aquiles Cancinos" }),
    ).toHaveAttribute("href", "/");
  });

  it("has no detectable accessibility violations", async () => {
    const Stub = createRoutesStub([{ path: "/", Component: Header }]);
    const { container } = render(<Stub initialEntries={["/"]} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
