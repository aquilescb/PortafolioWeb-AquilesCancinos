import { describe, expect, it } from "vitest";

import {
  globalMetaTags,
  milestoneBreadcrumbJsonLd,
  milestoneJsonLd,
  personJsonLd,
  projectBreadcrumbJsonLd,
  projectCreativeWorkJsonLd,
  websiteJsonLd,
} from "./json-ld";

const contact = {
  socials: [
    { url: "https://github.com/aquilescb" },
    { url: "https://www.linkedin.com/in/aquilescb123/" },
  ],
};

const project = {
  slug: "inventory-system",
  title: "Inventory System",
  summary: "Tracks inventory across warehouses.",
  year: 2025,
  cover: "/images/inventory-system/cover.jpg",
};

describe("personJsonLd", () => {
  it("builds a Person with the social links as sameAs, and no email", () => {
    const jsonLd = personJsonLd("es", contact);

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Aquiles Cancinos",
      jobTitle: "Desarrollador Full-Stack",
      url: "https://portafolio-web-aquiles-cancinos.vercel.app/es",
      sameAs: [
        "https://github.com/aquilescb",
        "https://www.linkedin.com/in/aquilescb123/",
      ],
    });
    expect(jsonLd).not.toHaveProperty("email");
  });

  it("localizes the job title and url per locale", () => {
    const jsonLd = personJsonLd("en", contact);

    expect(jsonLd.jobTitle).toBe("Full-Stack Developer");
    expect(jsonLd.url).toBe(
      "https://portafolio-web-aquiles-cancinos.vercel.app/en",
    );
  });
});

describe("globalMetaTags", () => {
  it("returns the root match's meta tags", () => {
    const rootTags = [{ "script:ld+json": { "@type": "Person" } }];
    const matches = [
      { id: "root", meta: rootTags },
      { id: "home-es", meta: [{ title: "Home" }] },
    ];

    expect(globalMetaTags(matches)).toBe(rootTags);
  });

  it("returns an empty array when there is no root match", () => {
    expect(
      globalMetaTags([{ id: "home-es", meta: [{ title: "Home" }] }]),
    ).toEqual([]);
  });
});

describe("websiteJsonLd", () => {
  it("builds a WebSite pointing at the localized home page", () => {
    expect(websiteJsonLd("es")).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Aquiles Cancinos",
      url: "https://portafolio-web-aquiles-cancinos.vercel.app/es",
      inLanguage: "es",
    });
  });
});

describe("projectCreativeWorkJsonLd", () => {
  it("builds a CreativeWork with an absolute url and image", () => {
    expect(projectCreativeWorkJsonLd(project, "es")).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Inventory System",
      description: "Tracks inventory across warehouses.",
      url: "https://portafolio-web-aquiles-cancinos.vercel.app/es/proyectos/inventory-system",
      image:
        "https://portafolio-web-aquiles-cancinos.vercel.app/images/inventory-system/cover.jpg",
      dateCreated: "2025",
      inLanguage: "es",
      author: { "@type": "Person", name: "Aquiles Cancinos" },
    });
  });
});

describe("projectBreadcrumbJsonLd", () => {
  it("builds a three-level breadcrumb ending at the project", () => {
    const jsonLd = projectBreadcrumbJsonLd(project, "en");

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Aquiles Cancinos",
        item: "https://portafolio-web-aquiles-cancinos.vercel.app/en",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://portafolio-web-aquiles-cancinos.vercel.app/en/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Inventory System",
        item: "https://portafolio-web-aquiles-cancinos.vercel.app/en/projects/inventory-system",
      },
    ]);
  });
});

const contestMilestone = {
  slug: "salta-lab-winner",
  title: "Salta Lab winner",
  summary: "Won first place at the Salta Lab contest.",
  date: "2025-11-15",
  organization: "Salta Lab",
  type: "contest" as const,
};

const pressMilestone = {
  slug: "local-press-feature",
  title: "Local press feature",
  summary: "Featured in a local newspaper.",
  date: "2025-06-01",
  type: "press" as const,
};

describe("milestoneJsonLd", () => {
  it("builds an Event for a contest, including its organizer", () => {
    expect(milestoneJsonLd(contestMilestone, "es")).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Salta Lab winner",
      description: "Won first place at the Salta Lab contest.",
      startDate: "2025-11-15",
      url: "https://portafolio-web-aquiles-cancinos.vercel.app/es/hitos/salta-lab-winner",
      inLanguage: "es",
      organizer: { "@type": "Organization", name: "Salta Lab" },
    });
  });

  it("builds a CreativeWork for a press milestone, with no organizer", () => {
    const jsonLd = milestoneJsonLd(pressMilestone, "en");

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Local press feature",
      datePublished: "2025-06-01",
      url: "https://portafolio-web-aquiles-cancinos.vercel.app/en/milestones/local-press-feature",
      author: { "@type": "Person", name: "Aquiles Cancinos" },
    });
    expect(jsonLd).not.toHaveProperty("organizer");
    expect(jsonLd).not.toHaveProperty("publisher");
  });
});

describe("milestoneBreadcrumbJsonLd", () => {
  it("builds a three-level breadcrumb ending at the milestone", () => {
    const jsonLd = milestoneBreadcrumbJsonLd(contestMilestone, "en");

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Aquiles Cancinos",
        item: "https://portafolio-web-aquiles-cancinos.vercel.app/en",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Career",
        item: "https://portafolio-web-aquiles-cancinos.vercel.app/en/career",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Salta Lab winner",
        item: "https://portafolio-web-aquiles-cancinos.vercel.app/en/milestones/salta-lab-winner",
      },
    ]);
  });
});
