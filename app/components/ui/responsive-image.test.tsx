import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { ResponsiveImage } from "./responsive-image";

describe("ResponsiveImage", () => {
  it("renders the fallback img with explicit width and height", () => {
    render(
      <ResponsiveImage
        src="/cover.jpg"
        alt="A project screenshot"
        width={800}
        height={533}
      />,
    );

    const img = screen.getByRole("img", { name: "A project screenshot" });
    expect(img).toHaveAttribute("src", "/cover.jpg");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "533");
  });

  it("defaults to lazy loading and automatic fetch priority", () => {
    const { container } = render(
      <ResponsiveImage src="/cover.jpg" alt="" width={800} height={533} />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("fetchpriority", "auto");
  });

  it("allows overriding loading and fetch priority for an LCP image", () => {
    render(
      <ResponsiveImage
        src="/cover.jpg"
        alt="Cover"
        width={800}
        height={533}
        loading="eager"
        fetchPriority="high"
      />,
    );

    const img = screen.getByRole("img", { name: "Cover" });
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("renders avif and webp sources when provided", () => {
    const { container } = render(
      <ResponsiveImage
        src="/cover.jpg"
        avif="/cover.avif"
        webp="/cover.webp"
        alt="Cover"
        width={800}
        height={533}
      />,
    );

    const sources = container.querySelectorAll("source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("type", "image/avif");
    expect(sources[0]).toHaveAttribute("srcset", "/cover.avif");
    expect(sources[1]).toHaveAttribute("type", "image/webp");
    expect(sources[1]).toHaveAttribute("srcset", "/cover.webp");
  });

  it("omits source elements when no variants are given", () => {
    const { container } = render(
      <ResponsiveImage src="/cover.jpg" alt="Cover" width={800} height={533} />,
    );

    expect(container.querySelectorAll("source")).toHaveLength(0);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <ResponsiveImage
        src="/cover.jpg"
        avif="/cover.avif"
        alt="Cover"
        width={800}
        height={533}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
