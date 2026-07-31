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
  },
  nav: {
    skipToContent: "Saltar al contenido",
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
    title: "Aquiles Cancinos",
    subtitle:
      "Vista previa del sistema de diseño — estructura de página, tipografía, tokens de color y primitivas de UI para la dirección editorial-técnica.",
    sections: {
      buttons: "Botones",
      tags: "Etiquetas",
      card: "Tarjeta",
      prose: "Prosa",
    },
    buttons: {
      primary: "Acción primaria",
      secondary: "Acción secundaria",
    },
    card: {
      title: "Tarjeta de ejemplo",
      body: "Borde fino, relleno generoso, sin sombra.",
    },
    prose: {
      before:
        "El texto largo, como un caso de estudio, se muestra dentro de esta medida de lectura con un",
      link: "enlace en línea",
      after: "de color de acento.",
    },
  },
};
