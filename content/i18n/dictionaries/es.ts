// No `as const`: `typeof es` must widen leaf values to `string` so `en`
// (below) only has to match the key structure, not the Spanish text itself.
export const es = {
  meta: {
    home: {
      title:
        "Aquiles Cancinos — Desarrollador Full-Stack | Sistemas web completos",
      description:
        "Diseño y construyo sistemas completos: interfaz, API, base de datos, seguridad y despliegue.",
    },
    notFound: {
      title: "Página no encontrada — Aquiles Cancinos",
    },
    projects: {
      title: "Proyectos — Aquiles Cancinos",
      description:
        "Proyectos y casos de estudio de Aquiles Cancinos: sistemas completos de interfaz, API, datos, seguridad y despliegue.",
    },
    about: {
      title: "Sobre mí — Aquiles Cancinos",
      description:
        "Estudiante avanzado de Ingeniería Informática, desarrollador full-stack. Bio, enfoque de trabajo y contacto.",
    },
  },
  common: {
    opensInNewTab: "(se abre en una pestaña nueva)",
  },
  nav: {
    skipToContent: "Saltar al contenido",
    projects: "Proyectos",
    about: "Sobre mí",
  },
  theme: {
    switchToDark: "Cambiar a tema oscuro",
    switchToLight: "Cambiar a tema claro",
  },
  language: {
    label: "Cambiar idioma",
    names: {
      es: "Español",
      en: "English",
    },
  },
  notFound: {
    eyebrow: "404",
    heading: "Página no encontrada",
    description: "La página que buscás no existe o fue movida.",
    backHome: "Volver al inicio",
  },
  redirect: {
    title: "Redirigiendo…",
    message: "Redirigiendo a la versión en español.",
    fallbackLink: "Si no fuiste redirigido automáticamente, hacé clic aquí.",
  },
  home: {
    heading: "Aquiles Cancinos",
    cta: {
      projects: "Ver proyectos",
      about: "Sobre mí",
    },
    featured: {
      heading: "Proyectos destacados",
      empty: "Todavía no hay proyectos destacados cargados.",
    },
    evidence: {
      heading: "Stack",
      intro: "Tecnologías con las que trabajé en los proyectos de arriba.",
      empty: "Todavía no hay tecnologías para mostrar.",
    },
  },
  projects: {
    heading: "Proyectos",
    intro:
      "Sistemas completos, con problema, decisiones técnicas y resultado verificable. Filtrá por tecnología, año o contexto.",
    filters: {
      technology: "Tecnología",
      year: "Año",
      context: "Contexto",
      category: "Categoría",
      clear: "Limpiar filtros",
      allYears: "Todos los años",
    },
    contexts: {
      professional: "Profesional",
      personal: "Personal",
      academic: "Académico",
      experimental: "Experimental",
    },
    empty: "Todavía no hay proyectos cargados con estos filtros.",
    viewProject: "Ver proyecto",
    privateRepository: "Repositorio privado",
    detail: {
      backToProjects: "Volver a proyectos",
      problem: "El problema",
      role: "Mi rol",
      stack: "Stack",
      year: "Año",
      duration: "Duración",
      teamSize: "Equipo",
      organization: "Organización",
      statusLabel: "Estado",
      status: {
        active: "Activo",
        completed: "Completado",
        archived: "Archivado",
      },
      repository: "Repositorio",
      demo: "Demo en vivo",
      screenshots: "Capturas",
      notTranslated:
        "Este caso de estudio todavía no está traducido a este idioma. Se muestra en el otro idioma disponible.",
    },
  },
  about: {
    heading: "Sobre mí",
    role: "Desarrollador Full-Stack",
    valueProp:
      "Diseño y construyo sistemas completos: interfaz, API, base de datos, seguridad y despliegue.",
    bio: "Soy estudiante avanzado de Ingeniería Informática (4.º año) y me dedico a diseñar y construir sistemas de software completos, desde la interfaz hasta el despliegue. Me define una curiosidad constante: aprendo por mi cuenta, entiendo el problema antes de escribir código, y disfruto tanto trabajar de forma individual como en equipos donde la comunicación clara marca la diferencia. Además de la formación técnica, trabajo activamente mi autodisciplina, la gestión del tiempo y la toma de decisiones bajo presión — herramientas tan importantes como cualquier lenguaje o framework. Hoy estoy enfocado en sumar experiencia profesional real y seguir creciendo como desarrollador full-stack.",
  },
  contact: {
    heading: "Contacto",
    intro: "¿Tenés un proyecto o una oportunidad en mente? Escribime.",
    email: "Email",
    copyEmail: "Copiar email",
    emailCopied: "¡Copiado!",
  },
};
