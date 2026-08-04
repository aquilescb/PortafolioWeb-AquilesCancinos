import { describe, expect, it, vi } from "vitest";

vi.mock("../content", () => ({
  getContact: vi.fn(() => ({
    emailUser: "aquiles",
    emailDomain: "example.com",
    socials: [
      {
        url: "https://github.com/aquilescb",
        label: "GitHub",
        kind: "profile",
      },
    ],
  })),
}));

const { loader, meta } = await import("./root");

function metaArgs(
  pathname: string,
  loaderData?: Awaited<ReturnType<typeof loader>>,
) {
  return {
    location: { pathname },
    params: {},
    matches: [],
    loaderData,
  } as unknown as Parameters<typeof meta>[0];
}

describe("root loader", () => {
  it("resolves contact info for the request's locale", async () => {
    const result = await loader({
      request: new Request("http://localhost/es"),
    } as Parameters<typeof loader>[0]);

    expect(result.contact.socials).toEqual([
      { url: "https://github.com/aquilescb", label: "GitHub", kind: "profile" },
    ]);
  });
});

describe("root meta", () => {
  it("renders global Person and WebSite JSON-LD", async () => {
    const data = await loader({
      request: new Request("http://localhost/es"),
    } as Parameters<typeof loader>[0]);

    const tags = meta(metaArgs("/es", data));

    expect(tags).toContainEqual({
      "script:ld+json": expect.objectContaining({
        "@type": "Person",
        name: "Aquiles Cancinos",
        sameAs: ["https://github.com/aquilescb"],
      }),
    });
    expect(tags).toContainEqual({
      "script:ld+json": expect.objectContaining({ "@type": "WebSite" }),
    });
  });

  it("returns nothing when there is no loader data", () => {
    expect(meta(metaArgs("/es", undefined))).toEqual([]);
  });
});
