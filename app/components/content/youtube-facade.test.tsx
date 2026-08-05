import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { YouTubeFacade } from "./youtube-facade";

function renderFacade(videoId = "dQw4w9WgXcQ", title = "Product demo") {
  return render(
    <MemoryRouter initialEntries={["/es"]}>
      <YouTubeFacade videoId={videoId} title={title} />
    </MemoryRouter>,
  );
}

describe("YouTubeFacade", () => {
  it("shows the thumbnail and play button, with no iframe, before activation", () => {
    renderFacade();

    expect(
      screen.getByRole("button", { name: "Reproducir video: Product demo" }),
    ).toBeInTheDocument();
    expect(screen.queryByTitle("Product demo")).not.toBeInTheDocument();
  });

  it("uses the video's own thumbnail image", () => {
    renderFacade("dQw4w9WgXcQ");

    const thumbnail = document.querySelector("img");
    expect(thumbnail).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    );
  });

  it("mounts the youtube-nocookie iframe only after a click", async () => {
    const user = userEvent.setup();
    renderFacade("dQw4w9WgXcQ", "Product demo");

    await user.click(
      screen.getByRole("button", { name: "Reproducir video: Product demo" }),
    );

    const iframe = screen.getByTitle("Product demo");
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1",
    );
    expect(
      screen.queryByRole("button", { name: /reproducir video/i }),
    ).not.toBeInTheDocument();
  });

  it("has no detectable accessibility violations before activation", async () => {
    const { container } = renderFacade();

    expect(await axe(container)).toHaveNoViolations();
  });
});
