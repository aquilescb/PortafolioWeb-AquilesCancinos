import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Button } from "./button";
import { Card } from "./card";
import { Link } from "./link";
import { Prose } from "./prose";
import { Tag } from "./tag";

describe("UI primitives", () => {
  it("renders each primitive with its content", () => {
    render(
      <MemoryRouter>
        <Button>Click me</Button>
        <Tag>React</Tag>
        <Card>Card body</Card>
        <Prose>
          <p>Paragraph</p>
        </Prose>
        <Link to="/">Go home</Link>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Click me" })).toBeVisible();
    expect(screen.getByText("React")).toBeVisible();
    expect(screen.getByText("Card body")).toBeVisible();
    expect(screen.getByText("Paragraph")).toBeVisible();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <Button>Click me</Button>
        <Link to="/">Go home</Link>
      </MemoryRouter>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
