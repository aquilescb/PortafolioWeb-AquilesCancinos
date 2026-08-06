import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SkillTag } from "./skill-tag";

describe("SkillTag", () => {
  it("renders the skill's name as plain text, with no numeric indicator", () => {
    render(
      <SkillTag skill={{ slug: "rest-api-design", name: "REST API design" }} />,
    );

    expect(screen.getByText("REST API design")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
