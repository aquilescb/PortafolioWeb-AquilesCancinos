import type { es } from "./es";

// Typed against `typeof es`: a missing or extra key here is a compile error,
// which is what keeps both locales in sync without a runtime i18n library.
export const en: typeof es = {
  meta: {
    home: {
      title: "Aquiles Cancinos — Full-Stack Developer | End-to-end web systems",
      description:
        "I design and build complete systems: interface, API, database, security and deployment.",
    },
    notFound: {
      title: "Page not found — Aquiles Cancinos",
    },
    projects: {
      title: "Projects — Aquiles Cancinos",
      description:
        "Aquiles Cancinos' projects and case studies: complete systems spanning interface, API, data, security and deployment.",
    },
  },
  nav: {
    skipToContent: "Skip to content",
    projects: "Projects",
  },
  theme: {
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
  },
  language: {
    label: "Switch language",
    names: {
      es: "Español",
      en: "English",
    },
  },
  notFound: {
    eyebrow: "404",
    heading: "Page not found",
    description: "The page you're looking for doesn't exist or was moved.",
    backHome: "Back to home",
  },
  redirect: {
    title: "Redirecting…",
    message: "Redirecting to the Spanish version.",
    fallbackLink: "If you were not redirected automatically, click here.",
  },
  home: {
    title: "Aquiles Cancinos",
    subtitle:
      "Design system preview — page shell, typography, colour tokens and UI primitives for the editorial-technical direction.",
    sections: {
      buttons: "Buttons",
      tags: "Tags",
      card: "Card",
      prose: "Prose",
    },
    buttons: {
      primary: "Primary action",
      secondary: "Secondary action",
    },
    card: {
      title: "Example card",
      body: "Hairline border, generous padding, no drop shadow.",
    },
    prose: {
      before:
        "Long-form text, such as a project case study, renders inside this reading measure with an",
      link: "inline link",
      after: "in the accent colour.",
    },
  },
  projects: {
    heading: "Projects",
    intro:
      "Complete systems, with the problem, technical decisions and a verifiable result. Filter by technology, year or context.",
    filters: {
      technology: "Technology",
      year: "Year",
      context: "Context",
      category: "Category",
      clear: "Clear filters",
      allYears: "All years",
    },
    contexts: {
      professional: "Professional",
      personal: "Personal",
      academic: "Academic",
      experimental: "Experimental",
    },
    empty: "No projects match these filters yet.",
    viewProject: "View project",
    privateRepository: "Private repository",
  },
};
