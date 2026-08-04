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
    about: {
      title: "About — Aquiles Cancinos",
      description:
        "Advanced Computer Engineering student, full-stack developer. Bio, working approach and contact.",
    },
  },
  common: {
    opensInNewTab: "(opens in a new tab)",
  },
  nav: {
    skipToContent: "Skip to content",
    projects: "Projects",
    about: "About",
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
    heading: "Aquiles Cancinos",
    cta: {
      projects: "View projects",
      about: "About me",
    },
    featured: {
      heading: "Featured projects",
      empty: "No featured projects loaded yet.",
    },
    evidence: {
      heading: "Stack",
      intro: "Technologies used in the projects above.",
      empty: "No technologies to show yet.",
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
    detail: {
      backToProjects: "Back to projects",
      problem: "The problem",
      role: "My role",
      stack: "Stack",
      year: "Year",
      duration: "Duration",
      teamSize: "Team",
      organization: "Organization",
      statusLabel: "Status",
      status: {
        active: "Active",
        completed: "Completed",
        archived: "Archived",
      },
      repository: "Repository",
      demo: "Live demo",
      screenshots: "Screenshots",
      notTranslated:
        "This case study isn't translated into this language yet. Showing the other available language.",
    },
  },
  about: {
    heading: "About",
    role: "Full-Stack Developer",
    valueProp:
      "I design and build complete systems: interface, API, database, security and deployment.",
    bio: "I'm an advanced Computer Engineering student (4th year) focused on designing and building complete software systems, from interface to deployment. I'm defined by constant curiosity: I learn on my own, make sure I understand a problem before writing code, and enjoy working both independently and in teams where clear communication makes the difference. Beyond technical training, I actively work on self-discipline, time management and decision-making under pressure — tools as important as any language or framework. Right now I'm focused on gaining real professional experience and continuing to grow as a full-stack developer.",
  },
  video: {
    playLabel: "Play video",
  },
  contact: {
    heading: "Contact",
    intro: "Have a project or an opportunity in mind? Reach out.",
    email: "Email",
    copyEmail: "Copy email",
    emailCopied: "Copied!",
  },
};
